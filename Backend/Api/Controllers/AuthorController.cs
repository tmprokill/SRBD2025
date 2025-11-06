using Api.ApiResult;
using Domain.Models;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorController : ControllerBase
{
    private readonly IAuthorRepository _authorRepository;

    public AuthorController(IAuthorRepository authorRepository)
    {
        _authorRepository = authorRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuthors()
    {
        var result = await _authorRepository.GetAuthorsAsync();

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
}

