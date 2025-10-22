using Api.ApiResult;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookCopyController : ControllerBase
{
    private readonly IBookCopyRepository _bookCopyRepository;

    public BookCopyController(IBookCopyRepository bookCopyRepository)
    {
        _bookCopyRepository = bookCopyRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookCopies()
    {
        var result = await _bookCopyRepository.GetBookCopiesAsync();

        return result.Match(
            successStatusCode: 200,
            includeBody: true,
            message: "null",
            failure: ApiResults.ToProblemDetails);
    }
}