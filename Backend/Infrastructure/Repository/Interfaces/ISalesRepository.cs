using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface ISalesRepository
{
    public Task<Result<IPagedList<Sale>>> GetSalesAsync(string? readerName = null,
        string? bookTitle = null,
        int page = 0,
        int pageSize = 10);
    
    public Task<Result<Sale>> GetSaleDetailsAsync(int saleId);
    
    public Task<Result> AddSaleAsync(SaleDTO sale);
    
    public Task<Result> UpdateSaleAsync(int saleId, SaleDTO sale);
    
    public Task<Result> DeleteSaleAsync(int saleId);
}