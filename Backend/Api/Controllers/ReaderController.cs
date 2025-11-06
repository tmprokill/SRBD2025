using Api.ApiResult;
using Domain.DTOs;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReaderController : ControllerBase
{
    private readonly IReaderRepository _readerRepository;

    public ReaderController(IReaderRepository readerRepository)
    {
        _readerRepository = readerRepository;
    }

    [HttpGet("{readerId}")]
    public async Task<IActionResult> GetReaderDetails(int readerId)
    {
        var result = await _readerRepository.GetReaderDetailsAsync(readerId);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetReaders()
    {
        var result = await _readerRepository.GetReadersAsync();

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPost]
    public async Task<IActionResult> AddReader([FromBody] ReaderDTO readerDto)
    {
        var result = await _readerRepository.AddReaderAsync(readerDto);

        return result.MatchNoData(
            successStatusCode: 201,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPut("{readerId}")]
    public async Task<IActionResult> UpdateReader(int readerId, [FromBody] ReaderDTO readerDto)
    {
        var result = await _readerRepository.UpdateReaderAsync(readerId, readerDto);

        return result.MatchNoData(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpDelete("{readerId}")]
    public async Task<IActionResult> DeleteReader(int readerId)
    {
        var result = await _readerRepository.DeleteReaderAsync(readerId);

        return result.MatchNoData(
            successStatusCode: 204,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpGet("count/city/{city}")]
    public async Task<IActionResult> CountReadersFromCity(string city)
    {
        var result = await _readerRepository.CountReadersFromCity(city);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
}