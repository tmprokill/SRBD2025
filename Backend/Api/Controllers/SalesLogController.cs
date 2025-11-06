using Api.ApiResult;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesLogController : ControllerBase
{
    private readonly ISalesLogRepository _salesLogRepository;

    public SalesLogController(ISalesLogRepository salesLogRepository)
    {
        _salesLogRepository = salesLogRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs(
        [FromQuery] int? saleId = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] int page = 0,
        [FromQuery] int pageSize = 10)
    {
        var result = await _salesLogRepository.GetLogsAsync(saleId, fromDate, toDate, page, pageSize);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
}