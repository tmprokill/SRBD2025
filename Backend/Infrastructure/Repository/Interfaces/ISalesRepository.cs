using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface ISalesRepository
{
    public Task<Result<Sale>> GetSaleDetailsAsync(int saleId);
    
    public Task<Result<bool>> AddSaleAsync(SaleDTO sale);
    
    public Task<Result<bool>> UpdateSaleAsync(int saleId, SaleDTO sale);
    
    public Task<Result<bool>> DeleteSaleAsync(int saleId);
}