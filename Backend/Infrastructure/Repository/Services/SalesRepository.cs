using System.Text;
using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.Errors.Sales;
using Infrastructure.Common.PagedList;
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

    public async Task<Result<IPagedList<Sale>>> GetSalesAsync(string? readerName = null, string? bookTitle = null, int page = 0,
        int pageSize = 10)
    {
        var sqlBuilder = new StringBuilder("""
                                               SELECT s.SaleID, s.ReaderID, s.BookID, s.SaleDate, s.Quantity, s.Price, 
                                                      r.ReaderID, r.FullName, r.Address, r.Phone, 
                                                      b.BookID, b.Title, b.AuthorID, b.GenreID, b.Price, b.Quantity, b.Description
                                               FROM Sales s
                                               LEFT JOIN Readers r ON s.ReaderID = r.ReaderID
                                               LEFT JOIN Books b ON s.BookID = b.BookID
                                           """);

        var countSqlBuilder = new StringBuilder("""
                                                    SELECT COUNT(*)
                                                    FROM Sales s
                                                    LEFT JOIN Readers r ON s.ReaderID = r.ReaderID
                                                    LEFT JOIN Books b ON s.BookID = b.BookID
                                                """);

        var whereClauses = new List<string>();
        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(readerName))
        {
            whereClauses.Add("r.FullName LIKE @ReaderName");
            parameters.Add("ReaderName", $"%{readerName}%");
        }

        if (!string.IsNullOrWhiteSpace(bookTitle))
        {
            whereClauses.Add("b.Title LIKE @BookTitle");
            parameters.Add("BookTitle", $"%{bookTitle}%");
        }

        if (whereClauses.Count > 0)
        {
            var whereClause = " WHERE " + string.Join(" AND ", whereClauses);
            sqlBuilder.Append(whereClause);
            countSqlBuilder.Append(whereClause);
        }

        sqlBuilder.Append(" ORDER BY s.SaleID ASC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

        parameters.Add("Offset", page * pageSize);
        parameters.Add("PageSize", pageSize);

        using var connection = await _connectionFactory.CreateDbConnection();
        try
        {
            var totalCount = await connection.QuerySingleAsync<int>(countSqlBuilder.ToString(), parameters);
            
            var sales = await connection.QueryAsync<Sale, Reader, Book, Sale>(sqlBuilder.ToString(),
                (sale, reader, book) =>
                {
                    sale.Reader = reader;
                    sale.Book = book;
                    return sale;
                }, parameters, splitOn: "ReaderID, BookID");

            var pagedList = new PagedList<Sale>(sales, totalCount, page, pageSize);
            return Result<IPagedList<Sale>>.Success(pagedList);
        }
        catch (SqlException ex)
        {
            return Result<IPagedList<Sale>>.Failure(RepositoryErrors<Sale>.NotFoundError);
        }
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
        const string checkBookSql = "SELECT Quantity FROM Books WHERE BookID = @BookId";
        const string insertSaleSql = 
             """
                 INSERT INTO Sales (ReaderID, BookID, SaleDate, Quantity, Price)
                 VALUES (@ReaderId, @BookId, GETDATE(), @Quantity, @Price)
             """;
        const string updateBookQuantitySql = 
             """
                 UPDATE Books 
                 SET Quantity = Quantity - @Quantity 
                 WHERE BookID = @BookId
             """;
        
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            using var transaction = connection.BeginTransaction();
            
            try
            {
                // Check if book exists and has enough quantity
                var bookQuantity = await connection.QuerySingleOrDefaultAsync<int?>(
                    checkBookSql,
                    param: new { BookId = sale.BookID },
                    transaction: transaction
                );

                if (!bookQuantity.HasValue)
                {
                    transaction.Rollback();
                    return Result.Failure(RepositoryErrors<Sale>.NotFoundError);
                }

                if (bookQuantity.Value < sale.Quantity)
                {
                    transaction.Rollback();
                    return Result.Failure(RepositoryErrors<Sale>.AddError);
                }

                // Insert the sale
                await connection.ExecuteAsync(
                    insertSaleSql,
                    param: new
                    {
                        ReaderId = sale.ReaderID,
                        BookId = sale.BookID,
                        Quantity = sale.Quantity,
                        Price = sale.Price
                    },
                    transaction: transaction
                );

                // Update book quantity
                await connection.ExecuteAsync(
                    updateBookQuantitySql,
                    param: new
                    {
                        BookId = sale.BookID,
                        Quantity = sale.Quantity
                    },
                    transaction: transaction
                );

                transaction.Commit();
                return Result.Success();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        catch (SqlException ex)
        {
            var errorMessage = ex.Message;
            
            // Check for specific error messages from trigger
            if (errorMessage.Contains("You cannot modify sales in not working days") ||
                errorMessage.Contains("You cannot modify sales on weekends"))
            {
                return Result.Failure(SalesErrors.NotWorkingDays);
            }
            
            if (errorMessage.Contains("You cannot modify sales in not working hours") ||
                errorMessage.Contains("You cannot modify sales outside working hours"))
            {
                return Result.Failure(SalesErrors.NotWorkingHours);
            }
            
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
            var errorMessage = ex.Message;
            
            // Check for specific error messages from trigger
            if (errorMessage.Contains("You cannot modify sales in not working days") ||
                errorMessage.Contains("You cannot modify sales on weekends"))
            {
                return Result.Failure(SalesErrors.NotWorkingDays);
            }
            
            if (errorMessage.Contains("You cannot modify sales in not working hours") ||
                errorMessage.Contains("You cannot modify sales outside working hours"))
            {
                return Result.Failure(SalesErrors.NotWorkingHours);
            }
            
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