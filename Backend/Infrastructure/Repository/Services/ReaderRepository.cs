using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class ReaderRepository : IReaderRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public ReaderRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<IEnumerable<Reader>>> GetReadersAsync()
    {
        const string selectUsersSql = "SELECT ReaderID, FullName, Address, Phone FROM Readers ORDER BY FullName ASC";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();

            var users = await connection.QueryAsync<Reader>(selectUsersSql);
            return Result<IEnumerable<Reader>>.Success(users);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<Reader>>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result<Reader>> GetReaderDetailsAsync(int readerId)
    {
        const string selectUserSql = "SELECT ReaderID, FullName, Address, Phone FROM Readers WHERE readerId = @readerId";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var users = await connection.QuerySingleAsync<Reader>(selectUserSql, param: new { readerId = readerId });
            return Result<Reader>.Success(users);
        }
        catch (SqlException ex)
        {
            return Result<Reader>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result> AddReaderAsync(ReaderDTO readerDto)
    {
        const string addReaderSql = 
            """
                INSERT INTO Readers (FullName, Address, Phone) 
                VALUES (@FullName, @Address, @Phone);
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(addReaderSql,
                param: new
                {
                    FullName = readerDto.FullName,
                    Address = readerDto.Address,
                    Phone = readerDto.Phone
                });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Reader>.AddError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Reader>.AddError);
        }
    }

    public async Task<Result> UpdateReaderAsync(int readerId, ReaderDTO readerDto)
    {
        const string updateReaderSql = 
            """
               UPDATE Readers 
               SET FullName = @FullName, Address = @Address , Phone = @Phone
               WHERE ReaderID= @ReaderId
           """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(updateReaderSql,
                param: new
                {
                    ReaderId = readerId,
                    FullName = readerDto.FullName,
                    Address = readerDto.Address,
                    Phone = readerDto.Phone
                });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Reader>.UpdateError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Reader>.UpdateError);
        }
    }

    public async Task<Result> DeleteReaderAsync(int readerId)
    {
        const string selectUserSql =
            """
            DELETE FROM Readers 
            WHERE ReaderID = @ReaderId;
            """;
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(selectUserSql, param: new { ReaderId = readerId, });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Reader>.DeleteError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            if (ex.Number == 547)
            {
                return Result.Failure(RepositoryErrors<Reader>.CascadeError);
            }
            
            return Result.Failure(RepositoryErrors<Reader>.DeleteError);
        }
    }

    public async Task<Result<int>> CountReadersFromCity(string city)
    {
        const string countReadersSql = "SELECT dbo.CountReadersFromCity(@City)";
        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var countReaders = await connection.QuerySingleAsync<int>(countReadersSql, param: new { City = city, });

            return Result<int>.Success(countReaders);
        }
        catch (SqlException ex)
        {
            return Result<int>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }
}