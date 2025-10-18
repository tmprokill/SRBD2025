using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;

namespace Infrastructure.Repository.Services;

public class ReaderRepository : IReaderRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public ReaderRepository(DbConnectionFactory connectionFactory)
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
        catch (Exception ex)
        {
            return Result<Reader>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result<bool>> UpdateReaderAsync(int readerId, ReaderDTO readerDto)
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
                return Result<bool>.Failure(RepositoryErrors<Reader>.NotFoundError);
            }

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result<bool>> DeleteReaderAsync(int readerId)
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
                return Result<bool>.Failure(RepositoryErrors<Reader>.NotFoundError);
            }

            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }
}