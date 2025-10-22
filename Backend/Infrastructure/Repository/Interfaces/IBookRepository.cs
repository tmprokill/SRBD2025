using Domain.DTOs;
using Domain.Models;
using Domain.Responses;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface IBookRepository
{
    public Task<Result> AddNewBookAsync(BookDTO book);
    
    public Task<Result> UpdateBookAsync(int bookId, BookDTO book);
    
    public Task<Result> DeleteBookAsync(int bookId);

    public Task<Result<IEnumerable<Book>>> GetBooksAsync();
    
    public Task<Result<Book>> GetBookDetailsAsync(int bookId);
    
    //procedure
    public Task<Result> UpdateBookDescriptionByPrice();
    
    //procedure
    public Task<Result> CutThePrice(int percent, double minSalesValue);
    
    //function
    public Task<Result<int>> CountGreaterThanAvgPrice();
    
    //function
    public Task<Result<int>> CountBooksMorePriceThan(double price);
    
    //function
    public Task<Result<IEnumerable<SecondPopularBookResponse>>> GetSecondPopularBookAsync(int minTotalSold);
}