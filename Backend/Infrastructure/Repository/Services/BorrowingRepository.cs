using System.Text;
using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
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

    public async Task<Result<IEnumerable<Borrowing>>> GetBorrowingsAsync(int? readerId = null, int? bookId = null, int page = 0,
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

        var whereClauses = new List<string>();
        var parameters = new DynamicParameters();

        if (readerId.HasValue)
        {
            whereClauses.Add("r.ReaderId = @ReaderId");
            parameters.Add("ReaderId", readerId);
        }

        if (bookId.HasValue)
        {
            whereClauses.Add("b.BookId = @BookId");
            parameters.Add("BookId", bookId);
        }

        if (whereClauses.Count > 0)
        {
            sqlBuilder.Append(" WHERE ").Append(string.Join(" AND ", whereClauses));
        }

        sqlBuilder.Append(" ORDER BY BorrowDate DESC OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY");

        parameters.Add("Offset", page * pageSize);
        parameters.Add("PageSize", pageSize);

        using var connection = await _connectionFactory.CreateDbConnection();
        try
        {
            var borrowings = await connection.QueryAsync<Borrowing, Reader, Book, Borrowing>(sqlBuilder.ToString(),
                (borrowing, reader, book) =>
                {
                    borrowing.Reader = reader;
                    borrowing.Book = book;
                    return borrowing;
                }, parameters, splitOn: "ReaderId, BookId");

            return Result<IEnumerable<Borrowing>>.Success(borrowings);
        }
        catch (SqlException ex)
        {
            return Result<IEnumerable<Borrowing>>.Failure(RepositoryErrors<Borrowing>.NotFoundError);
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

            if (result != 0)
            {
                return Result.Failure(RepositoryErrors<Borrowing>.AddError);
            }
            //Fix error handling from stored procedure
            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Borrowing>.AddError);
        }
    }

    public async Task<Result> FinalizeBorrowingAsync(int borrowingId)
    {
        const string finalizeBorrowingSql = "EXEC usp_Add_New_Borrowing @BorrowId";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(finalizeBorrowingSql, param: new { BorrowId = borrowingId });

            if (result != 0)
            {
                return Result.Failure(RepositoryErrors<Borrowing>.UpdateError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Borrowing>.UpdateError);
        }
    }
}