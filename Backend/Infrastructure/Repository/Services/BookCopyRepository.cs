using Dapper;
using Domain.Models;
using Domain.Responses;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class BookCopyRepository : IBookCopyRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public BookCopyRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }
    
    public async Task<Result<IEnumerable<BookCopyResponse>>> GetBookCopiesAsync()
    {
        const string selectBookCopiesSql = "SELECT BookCopyID, Title, OldPrice, NewPrice FROM BookCopy";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();

            var users = await connection.QueryAsync<BookCopyResponse>(selectBookCopiesSql);
            return Result<IEnumerable<BookCopyResponse>>.Success(users);
        }
        catch (SqlException ex)
        {
            return Result<IEnumerable<BookCopyResponse>>.Failure(RepositoryErrors<BookCopy>.NotFoundError);
        }
    }
}