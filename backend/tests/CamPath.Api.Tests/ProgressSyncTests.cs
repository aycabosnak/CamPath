using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using CamPath.Api.Contracts;

namespace CamPath.Api.Tests;

public class ProgressSyncTests(CamPathApiFactory factory) : IClassFixture<CamPathApiFactory>
{
    private static DateTime T(string iso) => DateTime.Parse(iso, null, System.Globalization.DateTimeStyles.AdjustToUniversal | System.Globalization.DateTimeStyles.AssumeUniversal);

    private static LessonCompletionDto Lesson(string at, int minutes = 5, bool firstTry = true) =>
        new() { CompletedAt = T(at), MinutesSpent = minutes, CorrectFirstTry = firstTry };

    private static ScoreRecordDto Score(string at, int correct, int total = 10) =>
        new() { CompletedAt = T(at), CorrectCount = correct, TotalCount = total };

    private static async Task<SyncResponse> SyncAsync(HttpClient client, ProgressStateDto progress, PlacementDto? placement = null)
    {
        var res = await client.PutAsJsonAsync("/api/progress/sync", new SyncRequest { Progress = progress, Placement = placement });
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        return (await res.Content.ReadFromJsonAsync<SyncResponse>())!;
    }

    [Fact]
    public async Task Sync_requires_authentication()
    {
        var res = await factory.CreateClient().PutAsJsonAsync("/api/progress/sync", new SyncRequest());
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task New_account_starts_empty()
    {
        var client = await factory.CreateSignedInClientAsync();
        var state = await client.GetFromJsonAsync<SyncResponse>("/api/progress");
        Assert.Empty(state!.Progress.CurriculumCompletions);
        Assert.Equal(0, state.Progress.StudyTimeMinutes);
        Assert.Null(state.Placement);
    }

    [Fact]
    public async Task Sync_is_idempotent_and_never_double_counts_study_time()
    {
        var client = await factory.CreateSignedInClientAsync();
        var state = new ProgressStateDto
        {
            CurriculumCompletions = { ["a1-grammar-1"] = Lesson("2026-11-01T10:00:00Z", 4) },
            Completions = { ["unit-1"] = Lesson("2026-11-01T11:00:00Z", 6) },
            StudyTimeMinutes = 999, // client value is ignored
            StudyDates = ["2026-11-01"],
        };

        await SyncAsync(client, state);
        var second = await SyncAsync(client, state);

        Assert.Single(second.Progress.CurriculumCompletions);
        Assert.Single(second.Progress.Completions);
        Assert.Single(second.Progress.StudyDates);
        Assert.Equal(10, second.Progress.StudyTimeMinutes);
    }

    [Fact]
    public async Task Two_devices_converge_on_the_union_of_their_progress()
    {
        var laptop = await factory.CreateSignedInClientAsync("two-devices@example.com");
        var phone = factory.CreateClient();
        var login = await phone.PostAsJsonAsync("/api/auth/login", new LoginRequest("two-devices@example.com", "correct-horse-1"));
        phone.DefaultRequestHeaders.Authorization =
            new("Bearer", (await login.Content.ReadFromJsonAsync<AuthResponse>())!.AccessToken);

        await SyncAsync(laptop, new ProgressStateDto
        {
            CurriculumCompletions = { ["a1-grammar-1"] = Lesson("2026-11-01T10:00:00Z") },
            StudyDates = ["2026-11-01"],
        });
        var merged = await SyncAsync(phone, new ProgressStateDto
        {
            CurriculumCompletions = { ["a1-vocabulary-1"] = Lesson("2026-11-02T10:00:00Z") },
            StudyDates = ["2026-11-02"],
        });

        Assert.Equal(["a1-grammar-1", "a1-vocabulary-1"], merged.Progress.CurriculumCompletions.Keys.Order());
        Assert.Equal(["2026-11-01", "2026-11-02"], merged.Progress.StudyDates);
    }

    [Fact]
    public async Task Earliest_lesson_completion_wins()
    {
        var client = await factory.CreateSignedInClientAsync();
        await SyncAsync(client, new() { CurriculumCompletions = { ["a2-reading-1"] = Lesson("2026-11-05T10:00:00Z", 9, false) } });

        var later = await SyncAsync(client, new() { CurriculumCompletions = { ["a2-reading-1"] = Lesson("2026-11-09T10:00:00Z", 1, true) } });
        Assert.Equal(T("2026-11-05T10:00:00Z"), later.Progress.CurriculumCompletions["a2-reading-1"].CompletedAt);
        Assert.False(later.Progress.CurriculumCompletions["a2-reading-1"].CorrectFirstTry);

        var earlier = await SyncAsync(client, new() { CurriculumCompletions = { ["a2-reading-1"] = Lesson("2026-11-03T10:00:00Z", 2, true) } });
        Assert.Equal(T("2026-11-03T10:00:00Z"), earlier.Progress.CurriculumCompletions["a2-reading-1"].CompletedAt);
        Assert.Equal(2, earlier.Progress.StudyTimeMinutes);
    }

    [Fact]
    public async Task Latest_test_attempt_and_progress_check_win()
    {
        var client = await factory.CreateSignedInClientAsync();
        await SyncAsync(client, new()
        {
            TestAttempts = { ["b1-intermediate:test-1"] = Score("2026-11-10T10:00:00Z", 8) },
            ProgressChecks = { ["b1-intermediate"] = Score("2026-11-10T10:00:00Z", 9) },
        });
        var result = await SyncAsync(client, new()
        {
            TestAttempts = { ["b1-intermediate:test-1"] = Score("2026-11-08T10:00:00Z", 2) }, // older: ignored
            ProgressChecks = { ["b1-intermediate"] = Score("2026-11-12T10:00:00Z", 6) },      // newer: replaces
        });

        Assert.Equal(8, result.Progress.TestAttempts["b1-intermediate:test-1"].CorrectCount);
        Assert.Equal(6, result.Progress.ProgressChecks["b1-intermediate"].CorrectCount);
    }

    [Fact]
    public async Task Milestones_are_recorded_once_at_their_earliest_date()
    {
        var client = await factory.CreateSignedInClientAsync();
        var milestone = new MilestoneDto { Id = "a1-elementary", Label = "Completed A1 Elementary", AchievedAt = T("2026-11-04T10:00:00Z") };
        await SyncAsync(client, new() { Milestones = [milestone] });
        var result = await SyncAsync(client, new()
        {
            Milestones =
            [
                new MilestoneDto { Id = "a1-elementary", Label = "Completed A1 Elementary", AchievedAt = T("2026-11-06T10:00:00Z") },
                new MilestoneDto { Id = "b1-plus-upper-intermediate", Label = "Bridge to B2 completed", AchievedAt = T("2026-11-07T10:00:00Z"), IsBridge = true },
            ],
        });

        Assert.Equal(2, result.Progress.Milestones.Count);
        Assert.Equal(T("2026-11-04T10:00:00Z"), result.Progress.Milestones.Single(m => m.Id == "a1-elementary").AchievedAt);
        Assert.True(result.Progress.Milestones.Single(m => m.Id == "b1-plus-upper-intermediate").IsBridge);
    }

    [Fact]
    public async Task Mastery_is_last_write_wins_per_skill()
    {
        var client = await factory.CreateSignedInClientAsync();
        await SyncAsync(client, new()
        {
            MasteryOverrides = { ["grammar"] = 60, ["reading"] = 70 },
            MasteryUpdatedAt = { ["grammar"] = T("2026-11-10T10:00:00Z"), ["reading"] = T("2026-11-10T10:00:00Z") },
        });
        var result = await SyncAsync(client, new()
        {
            MasteryOverrides = { ["grammar"] = 90, ["reading"] = 10, ["writing"] = 40 },
            MasteryUpdatedAt = { ["grammar"] = T("2026-11-11T10:00:00Z") }, // reading/writing: no timestamp (legacy client)
        });

        Assert.Equal(90, result.Progress.MasteryOverrides["grammar"]); // newer wins
        Assert.Equal(70, result.Progress.MasteryOverrides["reading"]); // untimestamped never overwrites
        Assert.Equal(40, result.Progress.MasteryOverrides["writing"]); // ...but fills a gap
    }

    [Fact]
    public async Task Latest_placement_result_wins_and_round_trips_verbatim()
    {
        var client = await factory.CreateSignedInClientAsync();
        var a2 = JsonDocument.Parse("""{"stage":"Explorer","cefr":"A2","correctCount":6}""").RootElement;
        var b1 = JsonDocument.Parse("""{"stage":"Communicator","cefr":"B1","correctCount":9}""").RootElement;

        await SyncAsync(client, new(), new PlacementDto { CompletedAt = T("2026-11-02T10:00:00Z"), Result = b1 });
        var result = await SyncAsync(client, new(), new PlacementDto { CompletedAt = T("2026-11-01T10:00:00Z"), Result = a2 });

        Assert.Equal("B1", result.Placement!.Result.GetProperty("cefr").GetString());
        Assert.Equal(9, result.Placement.Result.GetProperty("correctCount").GetInt32());
    }

    [Fact]
    public async Task Users_never_see_each_others_progress()
    {
        var alice = await factory.CreateSignedInClientAsync();
        var bob = await factory.CreateSignedInClientAsync();
        await SyncAsync(alice, new() { CurriculumCompletions = { ["c1-grammar-1"] = Lesson("2026-11-01T10:00:00Z") } });

        var bobs = await bob.GetFromJsonAsync<SyncResponse>("/api/progress");
        Assert.Empty(bobs!.Progress.CurriculumCompletions);
    }

    public static TheoryData<string, object> InvalidPayloads => new()
    {
        { "unknown skill", new { progress = new { masteryOverrides = new Dictionary<string, int> { ["dancing"] = 50 } } } },
        { "bad date", new { progress = new { studyDates = new[] { "26/11/2026" } } } },
        { "score > total", new { progress = new { testAttempts = new Dictionary<string, object> { ["x:test-1"] = new { completedAt = "2026-11-01T00:00:00Z", correctCount = 11, totalCount = 10 } } } } },
        { "placement not object", new { progress = new { }, placement = new { completedAt = "2026-11-01T00:00:00Z", result = "oops" } } },
        { "too many entries", new { progress = new { studyDates = Enumerable.Range(0, 501).Select(i => new DateOnly(2020, 1, 1).AddDays(i).ToString("yyyy-MM-dd")).ToArray() } } },
    };

    [Theory]
    [MemberData(nameof(InvalidPayloads))]
    public async Task Sync_rejects_invalid_payloads(string _, object payload)
    {
        var client = await factory.CreateSignedInClientAsync();
        var res = await client.PutAsJsonAsync("/api/progress/sync", payload);
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }
}
