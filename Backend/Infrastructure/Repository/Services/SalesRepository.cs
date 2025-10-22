using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class SalesRepository : ISalesRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public SalesRepository(IDbConnectionFactory connectionFactory)
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
                    b.BookID, b.Title, b.AuthorID, b.GenreID, b.Price, b.Quantity, b.Description,
                    a.AuthorID, a.Pseudonym, a.FirstName, a.LastName,
                    g.GenreID, g.GenreName, g.Description
                FROM Sales s
                LEFT JOIN Readers r ON s.ReaderID = r.ReaderID
                LEFT JOIN Books b ON s.BookID = b.BookID
                LEFT JOIN Authors a ON b.AuthorID = a.AuthorID
                LEFT JOIN Genres g ON b.GenreID = g.GenreID
                WHERE s.SaleID = @SaleId
            """;

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();

            var sales = await connection.QueryAsync<Sale, Reader, Book, Author, Genre, Sale>(
                selectSaleDetailSql,
                (sale, reader, book, author, genre) =>
                {
                    sale.Reader = reader;
                    book.Author = author;
                    book.Genre = genre;
                    sale.Book = book;
                    return sale;
                },
                new { SaleId = saleId },
                splitOn: "ReaderID,BookID,AuthorID,GenreID"
            );

            return Result<Sale>.Success(sales.First());
        }
        catch (SqlException ex)
        {
            return Result<Sale>.Failure(RepositoryErrors<Sale>.NotFoundError);
        }
    }

    public async Task<Result> AddSaleAsync(SaleDTO sale)
    {
        const string insertSaleSql = 
             """
                 INSERT INTO Sales (ReaderID, BookID, SaleDate, Quantity, Price)
                 VALUES (@ReaderId, @BookId, GETDATE(), @Quantity, @Price)
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

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Sale>.AddError);
        }
    }

    public async Task<Result> UpdateSaleAsync(int saleId, SaleDTO sale)
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

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Sale>.NotFoundError);
        }
    }

    public async Task<Result> DeleteSaleAsync(int saleId)
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
                return Result.Failure(RepositoryErrors<Sale>.NotFoundError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            if (ex.Number == 547)
            {
                return Result.Failure(RepositoryErrors<Sale>.CascadeError);
            }
                
            return Result.Failure(RepositoryErrors<Sale>.DeleteError);
        }
    }
}