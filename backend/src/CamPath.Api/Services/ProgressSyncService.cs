using System.Globalization;
using System.Text.Json;
using CamPath.Api.Contracts;
using CamPath.Api.Data;
using CamPath.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace CamPath.Api.Services;

/// <summary>
/// Two-way, merge-based progress sync.
///
/// The browser keeps working offline against localStorage; whenever it can,
/// it sends its whole state and gets the merged state back. Because every
/// rule below is commutative and idempotent, it doesn't matter how many
/// devices push, in what order, or how often — they all converge.
///
/// Merge rules (one per field, chosen to match what the frontend means):
/// <list type="bullet">
/// <item>Lesson completions — first completion wins (earliest completedAt).
///   The frontend never overwrites a completion record either.</item>
/// <item>Mixed Test attempts, Progress Checks — latest attempt wins.</item>
/// <item>Milestones — union by level, earliest achievement wins.</item>
/// <item>Study days — set union.</item>
/// <item>Mastery — per skill, latest masteryUpdatedAt wins.</item>
/// <item>Placement result — latest completedAt wins.</item>
/// <item>Study time — never merged; recomputed as the sum of lesson minutes.</item>
/// </list>
/// </summary>
public class ProgressSyncService(AppDbContext db, TimeProvider clock)
{
    /// <summary>Per-collection cap: generous for real use, small enough to
    /// stop a client from filling the database.</summary>
    public const int MaxEntriesPerCollection = 500;
    public const int MaxKeyLength = 100;
    public const int MaxPlacementJsonBytes = 64 * 1024;

    private static readonly HashSet<string> KnownSkills =
        ["grammar", "vocabulary", "listening", "reading", "useOfEnglish", "writing", "speaking"];

    public async Task<SyncResponse> GetAsync(Guid userId, CancellationToken ct = default) =>
        await BuildResponseAsync(userId, ct);

    public async Task<SyncResponse> SyncAsync(Guid userId, SyncRequest request, CancellationToken ct = default)
    {
        Validate(request);
        var p = request.Progress;

        await MergeCompletionsAsync(userId, LessonSource.StudyPath, p.Completions, ct);
        await MergeCompletionsAsync(userId, LessonSource.Curriculum, p.CurriculumCompletions, ct);
        await MergeTestAttemptsAsync(userId, p.TestAttempts, ct);
        await MergeProgressChecksAsync(userId, p.ProgressChecks, ct);
        await MergeMilestonesAsync(userId, p.Milestones, ct);
        await MergeStudyDaysAsync(userId, p.StudyDates, ct);
        await MergeMasteryAsync(userId, p.MasteryOverrides, p.MasteryUpdatedAt, ct);
        if (request.Placement is not null) await MergePlacementAsync(userId, request.Placement, ct);

        await db.SaveChangesAsync(ct);
        return await BuildResponseAsync(userId, ct);
    }

    // ------------------------------------------------------------ validation

    private static void Validate(SyncRequest r)
    {
        var p = r.Progress;
        CheckCollection(p.Completions.Keys, "completions");
        CheckCollection(p.CurriculumCompletions.Keys, "curriculumCompletions");
        CheckCollection(p.TestAttempts.Keys, "testAttempts");
        CheckCollection(p.ProgressChecks.Keys, "progressChecks");
        CheckCollection(p.Milestones.Select(m => m.Id), "milestones");
        CheckCollection(p.StudyDates, "studyDates");
        foreach (var d in p.StudyDates)
            if (!DateOnly.TryParseExact(d, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                throw new SyncValidationException($"Invalid study date '{d}'. Expected yyyy-MM-dd.");
        foreach (var s in p.MasteryOverrides.Keys.Concat(p.MasteryUpdatedAt.Keys))
            if (!KnownSkills.Contains(s))
                throw new SyncValidationException($"Unknown skill '{s}'.");
        foreach (var (key, rec) in p.TestAttempts.Concat(p.ProgressChecks))
            if (rec.CorrectCount > rec.TotalCount)
                throw new SyncValidationException($"'{key}': correctCount cannot exceed totalCount.");
        if (r.Placement is { } pl && pl.Result.ValueKind != JsonValueKind.Object)
            throw new SyncValidationException("placement.result must be a JSON object.");
        if (r.Placement is { } pl2 && pl2.Result.GetRawText().Length > MaxPlacementJsonBytes)
            throw new SyncValidationException("placement.result is too large.");
    }

    private static void CheckCollection(IEnumerable<string> keys, string name)
    {
        var list = keys.ToList();
        if (list.Count > MaxEntriesPerCollection)
            throw new SyncValidationException($"'{name}' has more than {MaxEntriesPerCollection} entries.");
        if (list.Any(k => string.IsNullOrWhiteSpace(k) || k.Length > MaxKeyLength))
            throw new SyncValidationException($"'{name}' contains an empty or over-long key.");
    }

    // ---------------------------------------------------------------- merges

    private async Task MergeCompletionsAsync(Guid userId, LessonSource source,
        Dictionary<string, LessonCompletionDto> incoming, CancellationToken ct)
    {
        if (incoming.Count == 0) return;
        var existing = await db.LessonCompletions
            .Where(x => x.UserId == userId && x.Source == source)
            .ToDictionaryAsync(x => x.LessonKey, ct);

        foreach (var (key, dto) in incoming)
        {
            var at = Utc(dto.CompletedAt);
            if (!existing.TryGetValue(key, out var row))
            {
                db.LessonCompletions.Add(new LessonCompletion
                {
                    UserId = userId, Source = source, LessonKey = key, CompletedAt = at,
                    CorrectFirstTry = dto.CorrectFirstTry, MinutesSpent = Math.Clamp(dto.MinutesSpent, 0, 600),
                });
            }
            else if (at < row.CompletedAt)
            {
                // An earlier first completion turned up (e.g. from an offline device).
                row.CompletedAt = at;
                row.CorrectFirstTry = dto.CorrectFirstTry;
                row.MinutesSpent = Math.Clamp(dto.MinutesSpent, 0, 600);
            }
        }
    }

    private async Task MergeTestAttemptsAsync(Guid userId, Dictionary<string, ScoreRecordDto> incoming, CancellationToken ct)
    {
        if (incoming.Count == 0) return;
        var existing = await db.TestAttempts.Where(x => x.UserId == userId).ToDictionaryAsync(x => x.TestKey, ct);
        foreach (var (key, dto) in incoming)
        {
            var at = Utc(dto.CompletedAt);
            if (!existing.TryGetValue(key, out var row))
                db.TestAttempts.Add(new TestAttempt
                {
                    UserId = userId, TestKey = key, CompletedAt = at,
                    CorrectCount = dto.CorrectCount, TotalCount = dto.TotalCount,
                });
            else if (at > row.CompletedAt)
                (row.CompletedAt, row.CorrectCount, row.TotalCount) = (at, dto.CorrectCount, dto.TotalCount);
        }
    }

    private async Task MergeProgressChecksAsync(Guid userId, Dictionary<string, ScoreRecordDto> incoming, CancellationToken ct)
    {
        if (incoming.Count == 0) return;
        var existing = await db.ProgressCheckResults.Where(x => x.UserId == userId).ToDictionaryAsync(x => x.LevelSlug, ct);
        foreach (var (key, dto) in incoming)
        {
            var at = Utc(dto.CompletedAt);
            if (!existing.TryGetValue(key, out var row))
                db.ProgressCheckResults.Add(new ProgressCheckResult
                {
                    UserId = userId, LevelSlug = key, CompletedAt = at,
                    CorrectCount = dto.CorrectCount, TotalCount = dto.TotalCount,
                });
            else if (at > row.CompletedAt)
                (row.CompletedAt, row.CorrectCount, row.TotalCount) = (at, dto.CorrectCount, dto.TotalCount);
        }
    }

    private async Task MergeMilestonesAsync(Guid userId, List<MilestoneDto> incoming, CancellationToken ct)
    {
        if (incoming.Count == 0) return;
        var existing = await db.Milestones.Where(x => x.UserId == userId).ToDictionaryAsync(x => x.LevelSlug, ct);
        foreach (var dto in incoming.GroupBy(m => m.Id).Select(g => g.MinBy(m => m.AchievedAt)!))
        {
            var at = Utc(dto.AchievedAt);
            if (!existing.TryGetValue(dto.Id, out var row))
                db.Milestones.Add(new Milestone
                {
                    UserId = userId, LevelSlug = dto.Id, Label = dto.Label, AchievedAt = at, IsBridge = dto.IsBridge,
                });
            else if (at < row.AchievedAt)
                (row.AchievedAt, row.Label, row.IsBridge) = (at, dto.Label, dto.IsBridge);
        }
    }

    private async Task MergeStudyDaysAsync(Guid userId, List<string> incoming, CancellationToken ct)
    {
        if (incoming.Count == 0) return;
        var existing = (await db.StudyDays.Where(x => x.UserId == userId).Select(x => x.Date).ToListAsync(ct)).ToHashSet();
        foreach (var d in incoming.Distinct())
        {
            var date = DateOnly.ParseExact(d, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            if (existing.Add(date)) db.StudyDays.Add(new StudyDay { UserId = userId, Date = date });
        }
    }

    private async Task MergeMasteryAsync(Guid userId, Dictionary<string, int> values,
        Dictionary<string, DateTime> updatedAt, CancellationToken ct)
    {
        if (values.Count == 0) return;
        var existing = await db.SkillMasteries.Where(x => x.UserId == userId).ToDictionaryAsync(x => x.Skill, ct);
        foreach (var (skill, pct) in values)
        {
            // Values from before timestamps existed count as "oldest": they
            // fill a gap but never overwrite a timestamped value.
            var at = updatedAt.TryGetValue(skill, out var t) ? Utc(t) : Oldest;
            var clamped = Math.Clamp(pct, 0, 100);
            if (!existing.TryGetValue(skill, out var row))
                db.SkillMasteries.Add(new SkillMastery { UserId = userId, Skill = skill, Percentage = clamped, UpdatedAt = at });
            else if (at > row.UpdatedAt)
                (row.Percentage, row.UpdatedAt) = (clamped, at);
        }
    }

    private async Task MergePlacementAsync(Guid userId, PlacementDto dto, CancellationToken ct)
    {
        var at = Utc(dto.CompletedAt);
        var row = await db.PlacementResults.FindAsync([userId], ct);
        if (row is null)
            db.PlacementResults.Add(new PlacementResult { UserId = userId, CompletedAt = at, ResultJson = dto.Result.GetRawText() });
        else if (at > row.CompletedAt)
            (row.CompletedAt, row.ResultJson) = (at, dto.Result.GetRawText());
    }

    // -------------------------------------------------------------- read-out

    private async Task<SyncResponse> BuildResponseAsync(Guid userId, CancellationToken ct)
    {
        var lessons = await db.LessonCompletions.AsNoTracking().Where(x => x.UserId == userId).ToListAsync(ct);
        var tests = await db.TestAttempts.AsNoTracking().Where(x => x.UserId == userId).ToListAsync(ct);
        var checks = await db.ProgressCheckResults.AsNoTracking().Where(x => x.UserId == userId).ToListAsync(ct);
        var milestones = await db.Milestones.AsNoTracking().Where(x => x.UserId == userId).ToListAsync(ct);
        var days = await db.StudyDays.AsNoTracking().Where(x => x.UserId == userId).Select(x => x.Date).ToListAsync(ct);
        var mastery = await db.SkillMasteries.AsNoTracking().Where(x => x.UserId == userId).ToListAsync(ct);
        var placement = await db.PlacementResults.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId, ct);

        LessonCompletionDto ToDto(LessonCompletion l) =>
            new() { CompletedAt = l.CompletedAt, CorrectFirstTry = l.CorrectFirstTry, MinutesSpent = l.MinutesSpent };

        var progress = new ProgressStateDto
        {
            Completions = lessons.Where(l => l.Source == LessonSource.StudyPath).ToDictionary(l => l.LessonKey, ToDto),
            CurriculumCompletions = lessons.Where(l => l.Source == LessonSource.Curriculum).ToDictionary(l => l.LessonKey, ToDto),
            TestAttempts = tests.ToDictionary(t => t.TestKey,
                t => new ScoreRecordDto { CompletedAt = t.CompletedAt, CorrectCount = t.CorrectCount, TotalCount = t.TotalCount }),
            ProgressChecks = checks.ToDictionary(c => c.LevelSlug,
                c => new ScoreRecordDto { CompletedAt = c.CompletedAt, CorrectCount = c.CorrectCount, TotalCount = c.TotalCount }),
            Milestones = milestones.OrderBy(m => m.AchievedAt)
                .Select(m => new MilestoneDto { Id = m.LevelSlug, Label = m.Label, AchievedAt = m.AchievedAt, IsBridge = m.IsBridge })
                .ToList(),
            StudyTimeMinutes = lessons.Sum(l => l.MinutesSpent),
            StudyDates = days.OrderBy(d => d).Select(d => d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)).ToList(),
            MasteryOverrides = mastery.ToDictionary(m => m.Skill, m => m.Percentage),
            MasteryUpdatedAt = mastery.Where(m => m.UpdatedAt > Oldest).ToDictionary(m => m.Skill, m => m.UpdatedAt),
        };

        return new SyncResponse
        {
            Progress = progress,
            Placement = placement is null
                ? null
                : new PlacementDto { CompletedAt = placement.CompletedAt, Result = JsonDocument.Parse(placement.ResultJson).RootElement.Clone() },
            SyncedAt = clock.GetUtcNow().UtcDateTime,
        };
    }

    private static readonly DateTime Oldest = DateTime.SpecifyKind(DateTime.MinValue, DateTimeKind.Utc);

    private static DateTime Utc(DateTime d) => d.Kind switch
    {
        DateTimeKind.Utc => d,
        DateTimeKind.Local => d.ToUniversalTime(),
        _ => DateTime.SpecifyKind(d, DateTimeKind.Utc),
    };
}

public class SyncValidationException(string message) : Exception(message);
