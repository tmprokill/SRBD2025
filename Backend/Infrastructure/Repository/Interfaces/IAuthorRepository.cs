using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface IAuthorRepository
{
    //procedure
    public Task<Result> AddAuthorAsync(AuthorDTO authorDto);
    
    public Task<Result<IEnumerable<Author>>> GetAuthorsAsync();
}