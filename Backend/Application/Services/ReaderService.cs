using Application.Interfaces;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Repository.Interfaces;

namespace Application.Services;

public class ReaderService : IReaderService
{
    private readonly IReaderRepository _readerRepository;

    public ReaderService(IReaderRepository readerRepository)
    {
        _readerRepository = readerRepository;
    }

    public async Task<Result<IEnumerable<Reader>>> GetReadersAsync()
    {
        var result = await _readerRepository.GetReadersAsync();

        return result;
    }

    public async Task<Result<Reader>> GetReaderDetailsAsync(int readerId)
    {
        var result = await _readerRepository.GetReaderDetailsAsync(readerId);

        return result;
    }

    public async Task<Result<bool>> UpdateReaderAsync(int readerId, ReaderDTO readerDto)
    {
        var result = await _readerRepository.UpdateReaderAsync(readerId, readerDto);

        return result;
    }

    public async Task<Result<bool>> DeleteReaderAsync(int readerId)
    {
        var result = await _readerRepository.DeleteReaderAsync(readerId);

        return result;
    }
}