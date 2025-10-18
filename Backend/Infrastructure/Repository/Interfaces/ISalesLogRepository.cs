using Domain.Models;
using Infrastructure.Common.ResultPattern;

namespace Infrastructure.Repository.Interfaces;

public interface ISalesLogRepository
{
    public Task<Result<IEnumerable<SalesLog>>> GetLogsAsync(int? saleId = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int page = 0,
        int pageSize = 10);
}