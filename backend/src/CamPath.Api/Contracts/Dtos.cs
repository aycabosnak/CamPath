using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace CamPath.Api.Contracts;

// ---------------------------------------------------------------- Auth

public record RegisterRequest(
    [Required(ErrorMessage = "Email is required."),
     EmailAddress(ErrorMessage = "Enter a valid email address."),
     MaxLength(254)] string Email,
    [Required(ErrorMessage = "Password is required."),
     MinLength(8, ErrorMessage = "Password must be at least 8 characters."),
     MaxLength(128, ErrorMessage = "Password must be at most 128 characters.")] string Password,
    [Required(ErrorMessage = "Name is required."),
     MaxLength(60, ErrorMessage = "Name must be at most 60 characters.")] string DisplayName);

public record LoginRequest(
    [Required(ErrorMessage = "Email is required."),
     EmailAddress(ErrorMessage = "Enter a valid email address.")] string Email,
    [Required(ErrorMessage = "Password is required.")] string Password);

public record UserDto(Guid Id, string Email, string DisplayName, DateTime CreatedAt);

public record AuthResponse(string AccessToken, DateTime ExpiresAt, UserDto User);

public record ErrorResponse(string Message);

// ------------------------------------------------------------ Progress
//
// These mirror the frontend's ProgressState (services/progressService.ts)
// field-for-field, so the client can send its localStorage state as-is
// and write the merged response straight back.

public class LessonCompletionDto
{
    public DateTime CompletedAt { get; set; }
    public bool CorrectFirstTry { get; set; }
    [Range(0, 600)] public int MinutesSpent { get; set; }
}

public class ScoreRecordDto
{
    public DateTime CompletedAt { get; set; }
    [Range(0, 1000)] public int CorrectCount { get; set; }
    [Range(0, 1000)] public int TotalCount { get; set; }
}

public class MilestoneDto
{
    [Required, MaxLength(100)] public string Id { get; set; } = string.Empty;
    [Required, MaxLength(200)] public string Label { get; set; } = string.Empty;
    public DateTime AchievedAt { get; set; }
    public bool IsBridge { get; set; }
}

public class ProgressStateDto
{
    public Dictionary<string, LessonCompletionDto> Completions { get; set; } = new();
    public Dictionary<string, LessonCompletionDto> CurriculumCompletions { get; set; } = new();
    public Dictionary<string, ScoreRecordDto> TestAttempts { get; set; } = new();
    public Dictionary<string, ScoreRecordDto> ProgressChecks { get; set; } = new();
    public List<MilestoneDto> Milestones { get; set; } = new();

    /// <summary>Output only — always recomputed from lesson minutes, so two
    /// devices can never double-count study time.</summary>
    public int StudyTimeMinutes { get; set; }

    /// <summary>ISO dates (yyyy-MM-dd).</summary>
    public List<string> StudyDates { get; set; } = new();
    public Dictionary<string, int> MasteryOverrides { get; set; } = new();

    /// <summary>When each mastery value was last set — the tie-breaker for
    /// "last write wins" across devices.</summary>
    public Dictionary<string, DateTime> MasteryUpdatedAt { get; set; } = new();
}

public class PlacementDto
{
    public DateTime CompletedAt { get; set; }
    /// <summary>The frontend's PlacementResult document, stored verbatim.</summary>
    public JsonElement Result { get; set; }
}

public class SyncRequest
{
    [Required] public ProgressStateDto Progress { get; set; } = new();
    public PlacementDto? Placement { get; set; }
}

public class SyncResponse
{
    public ProgressStateDto Progress { get; set; } = new();
    public PlacementDto? Placement { get; set; }
    public DateTime SyncedAt { get; set; }
}
