using Api.ApiResult;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IBookRepository _bookRepository;

    public BookController(IBookRepository bookRepository)
    {
        _bookRepository = bookRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        var result = await _bookRepository.GetBooksAsync();

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpGet("{bookId}")]
    public async Task<IActionResult> GetBookDetails(int bookId)
    {
        var result = await _bookRepository.GetBookDetailsAsync(bookId);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPost]
    public async Task<IActionResult> AddNewBook([FromBody] BookDTO bookDto)
    {
        var result = await _bookRepository.AddNewBookAsync(bookDto);

        return result.MatchNoData(
            successStatusCode: 201,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPut("{bookId}")]
    public async Task<IActionResult> UpdateBook(int bookId, [FromBody] BookDTO bookDto)
    {
        var result = await _bookRepository.UpdateBookAsync(bookId, bookDto);

        return result.MatchNoData(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpDelete("{bookId}")]
    public async Task<IActionResult> DeleteBook(int bookId)
    {
        var result = await _bookRepository.DeleteBookAsync(bookId);

        return result.MatchNoData(
            successStatusCode: 204,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPost("update-description-by-price")]
    public async Task<IActionResult> UpdateBookDescriptionByPrice()
    {
        var result = await _bookRepository.UpdateBookDescriptionByPrice();

        return result.MatchNoData(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpPost("cut-price")]
    public async Task<IActionResult> CutThePrice([FromQuery] int percent, [FromQuery] double minSalesValue)
    {
        var result = await _bookRepository.CutThePrice(percent, minSalesValue);

        return result.MatchNoData(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpGet("count/greater-than-avg-price")]
    public async Task<IActionResult> CountGreaterThanAvgPrice()
    {
        var result = await _bookRepository.CountGreaterThanAvgPrice();

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpGet("count/more-price-than/{price}")]
    public async Task<IActionResult> CountBooksMorePriceThan(double price)
    {
        var result = await _bookRepository.CountBooksMorePriceThan(price);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }

    [HttpGet("second-popular")]
    public async Task<IActionResult> GetSecondPopularBook([FromQuery] int minTotalSold)
    {
        var result = await _bookRepository.GetSecondPopularBookAsync(minTotalSold);

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
}