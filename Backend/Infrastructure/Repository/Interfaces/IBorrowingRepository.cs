using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface IBorrowingRepository
{
    public Task<Result<IPagedList<Borrowing>>> GetBorrowingsAsync(string? readerName = null,
        string? bookTitle = null,
        int page = 0,
        int pageSize = 10);

    //procedure
    public Task<Result> AddNewBorrowingAsync(BorrowingDTO borrowingDTO);

    //procedure
    public Task<Result> FinalizeBorrowingAsync(int borrowingId);
}