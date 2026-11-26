using CamPath.Api.Contracts;
using CamPath.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CamPath.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/progress")]
[Produces("application/json")]
public class ProgressController(ProgressSyncService sync, ILogger<ProgressController> logger) : ControllerBase
{
    /// <summary>The signed-in learner's full progress state.</summary>
    [HttpGet]
    [ProducesResponseType<SyncResponse>(StatusCodes.Status200OK)]
    public async Task<SyncResponse> Get(CancellationToken ct) => await sync.GetAsync(User.GetUserId(), ct);

    /// <summary>
    /// Merge this device's progress into the account and return the merged
    /// state. Safe to call any number of times with the same data.
    /// </summary>
    [HttpPut("sync")]
    [ProducesResponseType<SyncResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ErrorResponse>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Sync(SyncRequest request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        try
        {
            return Ok(await sync.SyncAsync(userId, request, ct));
        }
        catch (SyncValidationException ex)
        {
            return BadRequest(new ErrorResponse(ex.Message));
        }
        catch (DbUpdateException ex)
        {
            // Two devices inserted the same row at the same moment and one hit
            // a unique index. The merge is idempotent, so retrying with a fresh
            // context is always correct.
            logger.LogInformation(ex, "Concurrent progress sync for {UserId}; retrying once", userId);
            using var scope = HttpContext.RequestServices.CreateScope();
            var retry = scope.ServiceProvider.GetRequiredService<ProgressSyncService>();
            return Ok(await retry.SyncAsync(userId, request, ct));
        }
    }
}
