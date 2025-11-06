using Api.ApiResult;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BorrowingController : ControllerBase
{
    private readonly IBorrowingRepository _borrowingRepository;

    public BorrowingController(IBorrowingRepository borrowingRepository)
    {
        _borrowingRepository = borrowingRepository;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetBorrowings(
        [FromQuery] int? readerId = null,
        [FromQuery] int? bookId = null,
        [FromQuery] int page = 0,
        [FromQuery] int pageSize = 10)
    {
        var result = await _borrowingRepository.GetBorrowingsAsync(readerId, bookId, page, pageSize);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPost]
    public async Task<IActionResult> AddNewBorrowing([FromBody] BorrowingDTO borrowingDto)
    {
        var result = await _borrowingRepository.AddNewBorrowingAsync(borrowingDto);

        return result.MatchNoData(
            successStatusCode: 201,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPut("{borrowingId}/finalize")]
    public async Task<IActionResult> FinalizeBorrowing(int borrowingId)
    {
        var result = await _borrowingRepository.FinalizeBorrowingAsync(borrowingId);

        return result.MatchNoData(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
}