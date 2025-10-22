using System.Text;
using Dapper;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class SalesLogRepository : ISalesLogRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public SalesLogRepository(IDbConnectionFactory dbConnectionFactory)
    {
        _connectionFactory = dbConnectionFactory;
    }

    public async Task<Result<IEnumerable<SalesLog>>> GetLogsAsync(
        int? saleId = null,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int page = 0,
        int pageSize = 10)
    {
        try
        {
            var sqlBuilder = new StringBuilder("""
                                               SELECT Id, SaleID, NewQuantity, NewPrice, ModifyDate
                                               FROM SalesLogs
                                               """);

            var whereClauses = new List<string>();
            var parameters = new DynamicParameters();

            if (saleId.HasValue)
            {
                whereClauses.Add("SaleID = @SaleId");
                parameters.Add("SaleId", saleId);
            }
            if (fromDate.HasValue)
            {
                whereClauses.Add("ModifyDate >= @FromDate");
                parameters.Add("FromDate", fromDate);
            }
            if (toDate.HasValue)
            {
                whereClauses.Add("ModifyDate <= @ToDate");
                parameters.Add("ToDate", toDate);
            }
            if (whereClauses.Count > 0)
            {
                sqlBuilder.Append(" WHERE ").Append(string.Join(" AND ", whereClauses));
            }

            sqlBuilder.Append(" ORDER BY ModifyDate DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

            parameters.Add("Offset", page * pageSize);
            parameters.Add("PageSize", pageSize);

            using var connection = await _connectionFactory.CreateDbConnection();

            var logs = await connection.QueryAsync<SalesLog>(sqlBuilder.ToString(), parameters);

            return Result<IEnumerable<SalesLog>>.Success(logs);
        }
        catch (SqlException ex)
        {
            return Result<IEnumerable<SalesLog>>.Failure(RepositoryErrors<SalesLog>.NotFoundError);
        }
    }
}