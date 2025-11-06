using Api.ApiResult;
using Domain.Models;
using Infrastructure.Repository.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenreController : ControllerBase
{
    private readonly IGenreRepository _genreRepository;

    public GenreController(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetGenres()
    {
        var result = await _genreRepository.GetGenresAsync();

        return result.Match(
            successStatusCode: 200,
            failure: ApiResults.ToProblemDetails);
    }
}

