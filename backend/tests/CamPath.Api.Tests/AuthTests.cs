using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using CamPath.Api.Contracts;

namespace CamPath.Api.Tests;

public class AuthTests(CamPathApiFactory factory) : IClassFixture<CamPathApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    private static string NewEmail() => $"user-{Guid.NewGuid():N}@example.com";

    [Fact]
    public async Task Register_returns_token_and_normalised_user()
    {
        var email = NewEmail().ToUpperInvariant();
        var res = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, "secret-pass", "  Ayça "));

        Assert.Equal(HttpStatusCode.Created, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.False(string.IsNullOrWhiteSpace(body!.AccessToken));
        Assert.Equal(email.ToLowerInvariant(), body.User.Email);
        Assert.Equal("Ayça", body.User.DisplayName);
        Assert.True(body.ExpiresAt > DateTime.UtcNow.AddDays(6));
    }

    [Fact]
    public async Task Register_rejects_duplicate_email_case_insensitively()
    {
        var email = NewEmail();
        (await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, "secret-pass", "A"))).EnsureSuccessStatusCode();

        var res = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email.ToUpperInvariant(), "other-pass", "B"));

        Assert.Equal(HttpStatusCode.Conflict, res.StatusCode);
    }

    [Theory]
    [InlineData("not-an-email", "secret-pass", "Name")]
    [InlineData("a@example.com", "short", "Name")]
    [InlineData("a@example.com", "secret-pass", "")]
    public async Task Register_validates_input(string email, string password, string name)
    {
        var res = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, password, name));
        Assert.Equal(HttpStatusCode.BadRequest, res.StatusCode);
    }

    [Fact]
    public async Task Login_succeeds_with_correct_password()
    {
        var email = NewEmail();
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, "secret-pass", "A"));

        var res = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, "secret-pass"));

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        Assert.NotNull((await res.Content.ReadFromJsonAsync<AuthResponse>())!.AccessToken);
    }

    [Fact]
    public async Task Login_gives_the_same_answer_for_wrong_password_and_unknown_email()
    {
        var email = NewEmail();
        await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, "secret-pass", "A"));

        var wrongPassword = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, "wrong-pass"));
        var unknownEmail = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest(NewEmail(), "secret-pass"));

        Assert.Equal(HttpStatusCode.Unauthorized, wrongPassword.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, unknownEmail.StatusCode);
        Assert.Equal(
            (await wrongPassword.Content.ReadFromJsonAsync<ErrorResponse>())!.Message,
            (await unknownEmail.Content.ReadFromJsonAsync<ErrorResponse>())!.Message);
    }

    [Fact]
    public async Task Me_requires_a_valid_token()
    {
        Assert.Equal(HttpStatusCode.Unauthorized, (await _client.GetAsync("/api/auth/me")).StatusCode);

        var forged = factory.CreateClient();
        forged.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "not.a.token");
        Assert.Equal(HttpStatusCode.Unauthorized, (await forged.GetAsync("/api/auth/me")).StatusCode);

        var client = await factory.CreateSignedInClientAsync();
        var me = await client.GetFromJsonAsync<UserDto>("/api/auth/me");
        Assert.Equal("Learner", me!.DisplayName);
    }
}

public class RateLimitTests : IDisposable
{
    private readonly CamPathApiFactory _factory = new() { AuthPermitLimit = 3 };

    [Fact]
    public async Task Login_is_rate_limited_per_client()
    {
        var client = _factory.CreateClient();
        var statuses = new List<HttpStatusCode>();
        for (var i = 0; i < 4; i++)
            statuses.Add((await client.PostAsJsonAsync("/api/auth/login", new LoginRequest("a@example.com", "whatever1"))).StatusCode);

        Assert.Equal([HttpStatusCode.Unauthorized, HttpStatusCode.Unauthorized, HttpStatusCode.Unauthorized, HttpStatusCode.TooManyRequests], statuses);
    }

    public void Dispose() => _factory.Dispose();
}
