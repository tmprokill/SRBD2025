using Dapper;
using Domain.DTOs;
using Domain.Models;
using Domain.Responses;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class BookRepository : IBookRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public BookRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result> AddNewBookAsync(BookDTO bookDto)
    {
        const string addBookSql =
            """
                INSERT INTO Books (Title, AuthorID, GenreID, Price, Quantity, Description) 
                VALUES (@Title, @AuthorID, @GenreID, @Price, @Quantity, @Description);
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(addBookSql,
                param: new
                {
                    Title = bookDto.Title,
                    AuthorID = bookDto.AuthorID,
                    GenreID = bookDto.GenreID,
                    Price = bookDto.Price,
                    Quantity = bookDto.Quantity,
                    Description = bookDto.Description
                });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Book>.AddError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Book>.AddError);
        }
    }

    public async Task<Result> UpdateBookAsync(int bookId, BookDTO bookDto)
    {
        const string updateBookSql =
            """
                UPDATE Books 
                SET Title = @Title, AuthorID = @AuthorId , GenreID = @GenreId, Price = @Price, Quantity = @Quantity, Description = @Description
                WHERE BookID = @BookId
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(updateBookSql,
                param: new
                {
                    BookID = bookId,
                    Title = bookDto.Title,
                    AuthorId = bookDto.AuthorID,
                    GenreId = bookDto.GenreID,
                    Price = bookDto.Price,
                    Quantity = bookDto.Quantity,
                    Description = bookDto.Description
                });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Book>.UpdateError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Book>.NotFoundError);
        }
    }

    public async Task<Result> DeleteBookAsync(int bookId)
    {
        const string deleteBookSql =
            """
                DELETE FROM Books 
                WHERE BookID = @BookId;
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(deleteBookSql, param: new { BookId = bookId, });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Book>.DeleteError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            if (ex.Number == 547)
            {
                return Result.Failure(RepositoryErrors<Book>.CascadeError);
            }
            
            return Result.Failure(RepositoryErrors<Book>.DeleteError);
        }
    }

    public async Task<Result<IEnumerable<Book>>> GetBooksAsync()
    {
        const string selectBooksSql =
            """
               SELECT
                   b.BookID, b.Title, b.AuthorID, b.GenreID, b.Price, b.Quantity, b.Description, 
                   a.AuthorID, a.Pseudonym, a.FirstName, a.LastName,
                   g.GenreID, g.GenreName, g.Description
                FROM Books b
                LEFT JOIN Authors a ON b.AuthorID = a.AuthorID
                LEFT JOIN Genres g ON b.GenreID = g.GenreID
            """;

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();

            var books = await connection.QueryAsync<Book, Author, Genre, Book>(
                selectBooksSql,
                (book, author, genre) =>
                {
                    book.Author = author;
                    book.Genre = genre;
                    return book;
                },
                splitOn: "AuthorID,GenreID"
            );

            return Result<IEnumerable<Book>>.Success(books);
        }
        catch (SqlException ex)
        {
            return Result<IEnumerable<Book>>.Failure(RepositoryErrors<Book>.NotFoundError);
        }
    }

    public async Task<Result<Book>> GetBookDetailsAsync(int bookId)
    {
        const string selectBookDetailsSql =
            """
               SELECT
                   b.BookID, b.Title, b.AuthorID, b.GenreID, b.Price, b.Quantity, b.Description, 
                   a.AuthorID, a.Pseudonym, a.FirstName, a.LastName,
                   g.GenreID, g.GenreName, g.Description
                FROM Books b
                LEFT JOIN Authors a ON b.AuthorID = a.AuthorID
                LEFT JOIN Genres g ON b.GenreID = g.GenreID
                WHERE b.BookID = @BookId;
            """;

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();

            var books = await connection.QueryAsync<Book, Author, Genre, Book>(
                selectBookDetailsSql,
                (book, author, genre) =>
                {
                    book.Author = author;
                    book.Genre = genre;
                    return book;
                },
                param: new { BookId = bookId },
                splitOn: "AuthorID,GenreID"
            );

            return Result<Book>.Success(books.First());
        }
        catch (SqlException ex)
        {
            return Result<Book>.Failure(RepositoryErrors<Book>.NotFoundError);
        }
    }

    public async Task<Result> UpdateBookDescriptionByPrice()
    {
        const string updateBookDescriptionSql = "EXEC usp_UpdateBookDescriptions_ByPrice";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(updateBookDescriptionSql);
            
            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Book>.UpdateError);
        }
    }

    public async Task<Result> CutThePrice(int percent, double minSalesValue)
    {
        const string cutThePriceSql = "EXEC sp_CutThePrice @Percent, @MinSalesValue";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            await connection.ExecuteAsync(cutThePriceSql,
                param: new { Percent = percent, MinSalesValue = minSalesValue });

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Book>.UpdateError);
        }
    }

    public async Task<Result<int>> CountGreaterThanAvgPrice()
    {
        const string countGreaterThanAvgPriceSql = "SELECT dbo.count_greater_than_avg_price()";
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var countGreaterThanAvgPrice = await connection.QuerySingleAsync<int>(countGreaterThanAvgPriceSql);

            return Result<int>.Success(countGreaterThanAvgPrice);
        }
        catch (SqlException ex)
        {
            return Result<int>.Failure(RepositoryErrors<Book>.NotFoundError);
        }
    }

    public async Task<Result<int>> CountBooksMorePriceThan(double price)
    {
        const string countMorePriceThanSql = "SELECT dbo.count_books_more_price_than(@NewPrice)";
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var countBooksMorePriceThan =
                await connection.QuerySingleAsync<int>(countMorePriceThanSql, param: new { NewPrice = price, });

            return Result<int>.Success(countBooksMorePriceThan);
        }
        catch (SqlException ex)
        {
            return Result<int>.Failure(RepositoryErrors<Book>.NotFoundError);
        }
    }

    public async Task<Result<IEnumerable<SecondPopularBookResponse>>> GetSecondPopularBookAsync(int minTotalSold)
    {
        const string selectSecondPopularBookSql = "SELECT * FROM dbo.fn_GetEverySecondPopularBook(@MinQuantity)";
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var getEverySecondPopular =
                await connection.QueryAsync<SecondPopularBookResponse>(selectSecondPopularBookSql,
                    param: new { MinQuantity = minTotalSold, });

            return Result<IEnumerable<SecondPopularBookResponse> >.Success(getEverySecondPopular);
        }
        catch (SqlException ex)
        {
            return Result<IEnumerable<SecondPopularBookResponse>>.Failure(RepositoryErrors<Book>.NotFoundError);
        }
    }
}