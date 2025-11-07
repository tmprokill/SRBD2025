using System.Text;
using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.Borrowings;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.PagedList;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class BorrowingRepository : IBorrowingRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public BorrowingRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<IPagedList<Borrowing>>> GetBorrowingsAsync(string? readerName = null, string? bookTitle = null, int page = 0,
        int pageSize = 10)
    {
        var sqlBuilder = new StringBuilder("""
                                               SELECT br.BorrowID, br.ReaderID, br.BookID, br.BorrowDate, br.ReturnDate, br.Quantity, 
                                                      r.ReaderID, r.FullName, r.Address, r.Phone, 
                                                      b.BookID, b.Title, b.AuthorID, b.GenreID, b.Price, b.Quantity, b.Description
                                               FROM Borrowings br
                                               LEFT JOIN Readers r ON br.ReaderID = r.ReaderId
                                               LEFT JOIN Books b ON br.BookID = b.BookID
                                           """);

        var countSqlBuilder = new StringBuilder("""
                                                    SELECT COUNT(*)
                                                    FROM Borrowings br
                                                    LEFT JOIN Readers r ON br.ReaderID = r.ReaderId
                                                    LEFT JOIN Books b ON br.BookID = b.BookID
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

        sqlBuilder.Append(" ORDER BY BorrowID ASC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

        parameters.Add("Offset", page * pageSize);
        parameters.Add("PageSize", pageSize);

        using var connection = await _connectionFactory.CreateDbConnection();
        try
        {
            var totalCount = await connection.QuerySingleAsync<int>(countSqlBuilder.ToString(), parameters);
            
            var borrowings = await connection.QueryAsync<Borrowing, Reader, Book, Borrowing>(sqlBuilder.ToString(),
                (borrowing, reader, book) =>
                {
                    borrowing.Reader = reader;
                    borrowing.Book = book;
                    return borrowing;
                }, parameters, splitOn: "ReaderId, BookId");

            var pagedList = new PagedList<Borrowing>(borrowings, totalCount, page, pageSize);
            return Result<IPagedList<Borrowing>>.Success(pagedList);
        }
        catch (SqlException ex)
        {
            return Result<IPagedList<Borrowing>>.Failure(RepositoryErrors<Borrowing>.NotFoundError);
        }
    }

    public async Task<Result> AddNewBorrowingAsync(BorrowingDTO borrowingDTO)
    {
        const string addNewBorrowingSql = "EXEC usp_Add_New_Borrowing @ReaderId, @BookId, @Quantity";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(addNewBorrowingSql,
                param: new
                {
                    ReaderId = borrowingDTO.ReaderID,
                    BookId = borrowingDTO.BookID,
                    Quantity = borrowingDTO.Quantity,
                });
            
            return Result.Success();
        }
        catch (SqlException ex)
        {
            var errorMessage = ex.Message;
            
            // Check for specific error messages from stored procedure
            if (errorMessage.Contains("Немає книги з ID") || errorMessage.Contains("No book with ID"))
            {
                return Result.Failure(BorrowingErrors.BookNotFound);
            }
            
            if (errorMessage.Contains("Кількість, що ви намагаєтесь орендувати перевищує наявність") ||
                errorMessage.Contains("Quantity exceeds available"))
            {
                return Result.Failure(BorrowingErrors.QuantityExceedsAvailable);
            }
            
            return Result.Failure(RepositoryErrors<Borrowing>.AddError);
        }
    }

    public async Task<Result> FinalizeBorrowingAsync(int borrowingId)
    {
        const string finalizeBorrowingSql = "EXEC usp_FinalizeBorrowing @BorrowId";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(finalizeBorrowingSql, param: new { BorrowId = borrowingId });

            if (result == 0)
            {
                return Result.Failure(RepositoryErrors<Borrowing>.UpdateError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            var errorMessage = ex.Message;
            
            // Check for specific error messages from stored procedure
            if (errorMessage.Contains("Немає оренди з ID") || errorMessage.Contains("No borrowing with ID"))
            {
                return Result.Failure(BorrowingErrors.BorrowingNotFound);
            }
            
            if (errorMessage.Contains("Оренда вже повернута") || errorMessage.Contains("Borrowing already returned"))
            {
                return Result.Failure(BorrowingErrors.BorrowingAlreadyReturned);
            }
            
            return Result.Failure(RepositoryErrors<Borrowing>.UpdateError);
        }
    }
}