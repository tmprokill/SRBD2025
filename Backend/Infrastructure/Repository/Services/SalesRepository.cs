using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;

namespace Infrastructure.Repository.Services;

public class SalesRepository : ISalesRepository
{
    private readonly IDBConnectionFactory _connectionFactory;

    public SalesRepository(IDBConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<Sale>> GetSaleDetailsAsync(int saleId)
    {
        const string selectSaleDetailSql =
            """
               SELECT
                    s.SaleID, s.ReaderID, s.BookID, s.SaleDate, s.Quantity, s.Price,
                    r.ReaderID, r.FullName, r.Address, r.Phone,
                    b.BookID, b.Title, b.Author, b.ISBN, b.PublishYear, b.Price, b.Quantity
                FROM Sales s
                LEFT JOIN Readers r ON s.ReaderID = r.ReaderID
                LEFT JOIN Books b ON s.BookID = b.BookID
                WHERE s.SaleID = @SaleId
            """;

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();

            var sales = await connection.QueryAsync<Sale, Reader, Book, Sale>(
                selectSaleDetailSql,
                (sale, reader, book) =>
                {
                    sale.Reader = reader;
                    sale.Book = book;
                    return sale;
                },
                new { SaleId = saleId },
                splitOn: "ReaderID,BookID"
            );

            return Result<Sale>.Success(sales.First());
        }
        catch (Exception ex)
        {
            return Result<Sale>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result<bool>> AddSaleAsync(SaleDTO sale)
    {
        const string insertSaleSql = """
                                     INSERT INTO Sales (ReaderID, BookID, SaleDate, Quantity, Price)
                                     VALUES @ReaderId, @BookId, GETDATE(), @Quantity, @Price
                                     """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            await connection.ExecuteAsync(insertSaleSql,
                param: new
                {
                    ReaderId = sale.ReaderID,
                    BookId = sale.BookID,
                    Quantity = sale.Quantity,
                    Price = sale.Price
                });

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Sale>.AddError);
        }
    }

    public async Task<Result<bool>> UpdateSaleAsync(int saleId, SaleDTO sale)
    {
        const string updateSaleSql =
            """
            UPDATE Sales 
            SET ReaderID = @ReaderId, BookID = @BookId, SaleDate = @SaleDate, Quantity = @Quantity, Price = @Price
            WHERE SaleID = @SaleId;
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(updateSaleSql,
                param: new
                {
                    ReaderId = sale.ReaderID,
                    BookId = sale.BookID,
                    Quantity = sale.Quantity,
                    Price = sale.Price,
                    SaleDate = sale.SaleDate,
                    SaleId = saleId
                });

            if (result != 1)
            {
                return Result<bool>.Failure(RepositoryErrors<Sale>.NotFoundError);
            }

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Sale>.NotFoundError);
        }
    }

    public async Task<Result<bool>> DeleteSaleAsync(int saleId)
    {
        const string deleteSaleSql =
            """
            DELETE FROM Sales 
            WHERE SaleID = @SaleId;
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(deleteSaleSql, param: new { SaleId = saleId, });

            if (result != 1)
            {
                return Result<bool>.Failure(RepositoryErrors<Reader>.NotFoundError);
            }

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Reader>.DeleteError);
        }
    }
}