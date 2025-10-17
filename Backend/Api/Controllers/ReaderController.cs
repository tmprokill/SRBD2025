using Api.ApiResult;
using Application.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReaderController : ControllerBase
{
    private readonly IReaderService _readerService;

    public ReaderController(IReaderService readerService)
    {
        _readerService = readerService;
    }

    [HttpGet("id")]
    public async Task<IActionResult> GetReaderDetails(int readerId)
    {
        var result = await _readerService.GetReaderDetailsAsync(readerId);

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetReaders()
    {
        var result = await _readerService.GetReadersAsync();

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails);
    }
}