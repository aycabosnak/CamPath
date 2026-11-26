using CamPath.Api.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CamPath.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<LessonCompletion> LessonCompletions => Set<LessonCompletion>();
    public DbSet<TestAttempt> TestAttempts => Set<TestAttempt>();
    public DbSet<ProgressCheckResult> ProgressCheckResults => Set<ProgressCheckResult>();
    public DbSet<Milestone> Milestones => Set<Milestone>();
    public DbSet<StudyDay> StudyDays => Set<StudyDay>();
    public DbSet<SkillMastery> SkillMasteries => Set<SkillMastery>();
    public DbSet<PlacementResult> PlacementResults => Set<PlacementResult>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(254);
            e.Property(u => u.DisplayName).HasMaxLength(60);
        });

        // Every progress row belongs to a user and disappears with them.
        // The unique indexes are what make sync idempotent: one row per
        // (user, key), however many times the same state is pushed.
        b.Entity<LessonCompletion>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.Source, x.LessonKey }).IsUnique();
            e.Property(x => x.LessonKey).HasMaxLength(100);
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<TestAttempt>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.TestKey }).IsUnique();
            e.Property(x => x.TestKey).HasMaxLength(100);
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<ProgressCheckResult>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.LevelSlug }).IsUnique();
            e.Property(x => x.LevelSlug).HasMaxLength(100);
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<Milestone>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.LevelSlug }).IsUnique();
            e.Property(x => x.LevelSlug).HasMaxLength(100);
            e.Property(x => x.Label).HasMaxLength(200);
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<StudyDay>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.Date }).IsUnique();
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<SkillMastery>(e =>
        {
            e.HasIndex(x => new { x.UserId, x.Skill }).IsUnique();
            e.Property(x => x.Skill).HasMaxLength(30);
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        b.Entity<PlacementResult>(e =>
        {
            e.HasKey(x => x.UserId);
            e.HasOne<User>().WithOne().HasForeignKey<PlacementResult>(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        // SQLite has no time-zone-aware type: values come back with
        // DateTimeKind.Unspecified and would serialise without the "Z".
        // Everything is stored as UTC, so mark it UTC on the way out.
        var utc = new ValueConverter<DateTime, DateTime>(
            v => v.Kind == DateTimeKind.Local ? v.ToUniversalTime() : v,
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        foreach (var entity in b.Model.GetEntityTypes())
            foreach (var prop in entity.GetProperties().Where(p => p.ClrType == typeof(DateTime)))
                prop.SetValueConverter(utc);
    }
}
