using Domain.Models;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface IGenreRepository
{
    public Task<Result<IEnumerable<Genre>>> GetGenresAsync();
}

