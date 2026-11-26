namespace CamPath.Api.Domain;

/// <summary>A learner account. Email is stored lower-cased and is unique.</summary>
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Which lesson system a completion belongs to. The frontend keeps these
/// in two separate namespaces (legacy Study Path units vs. Level
/// Curriculum lessons), so the backend does too.
/// </summary>
public enum LessonSource
{
    StudyPath = 0,
    Curriculum = 1,
}

/// <summary>First completion of a lesson. Never overwritten by a later one.</summary>
public class LessonCompletion
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public LessonSource Source { get; set; }
    public required string LessonKey { get; set; }
    public DateTime CompletedAt { get; set; }
    public bool CorrectFirstTry { get; set; }
    public int MinutesSpent { get; set; }
}

/// <summary>Latest attempt of a Mixed Test, keyed "levelSlug:testId".</summary>
public class TestAttempt
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public required string TestKey { get; set; }
    public DateTime CompletedAt { get; set; }
    public int CorrectCount { get; set; }
    public int TotalCount { get; set; }
}

/// <summary>Latest Progress Check result for a level.</summary>
public class ProgressCheckResult
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public required string LevelSlug { get; set; }
    public DateTime CompletedAt { get; set; }
    public int CorrectCount { get; set; }
    public int TotalCount { get; set; }
}

/// <summary>Level milestone — recorded once, at its earliest achievement.</summary>
public class Milestone
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public required string LevelSlug { get; set; }
    public required string Label { get; set; }
    public DateTime AchievedAt { get; set; }
    public bool IsBridge { get; set; }
}

/// <summary>A calendar day (UTC) on which the learner studied.</summary>
public class StudyDay
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public DateOnly Date { get; set; }
}

/// <summary>Measured or practised mastery for one skill; last write wins.</summary>
public class SkillMastery
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public required string Skill { get; set; }
    public int Percentage { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// The learner's most recent Placement Test result. Stored as the
/// frontend's JSON document: it's only ever read back whole, and its
/// shape belongs to the (still heuristic) placement engine.
/// </summary>
public class PlacementResult
{
    public Guid UserId { get; set; }
    public required string ResultJson { get; set; }
    public DateTime CompletedAt { get; set; }
}
