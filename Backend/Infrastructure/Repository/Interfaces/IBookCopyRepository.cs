using Domain.Models;
using Domain.Responses;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface IBookCopyRepository
{
    public Task<Result<IEnumerable<BookCopyResponse>>> GetBookCopiesAsync();
}