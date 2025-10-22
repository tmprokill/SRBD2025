using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface IReaderRepository
{
    public Task<Result<IEnumerable<Reader>>> GetReadersAsync();
    
    public Task<Result<Reader>> GetReaderDetailsAsync(int readerId);

    public Task<Result> AddReaderAsync(ReaderDTO readerDto);
    
    public Task<Result> UpdateReaderAsync(int readerId, ReaderDTO readerDto);

    public Task<Result> DeleteReaderAsync(int readerId);

    //function
    public Task<Result<int>> CountReadersFromCity(string city);
}