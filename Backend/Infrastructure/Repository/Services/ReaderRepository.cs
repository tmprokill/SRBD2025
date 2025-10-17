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
        using var connection = await _connectionFactory.CreateDbConnection();

        const string selectUsersSql = "SELECT ReaderID, FullName, Adress, Phone FROM Readers";

        try
        {
            var users = await connection.QueryAsync<Reader>(selectUsersSql);
            return Result<IEnumerable<Reader>>.Success(users);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<Reader>>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result<IEnumerable<Reader>>> GetReaderDetailsAsync(int readerId)
    {
        using var connection = await _connectionFactory.CreateDbConnection();

        const string selectUserSql = "SELECT ReaderID, FullName, Adress, Phone FROM Readers WHERE readerId = @readerId";

        try
        {
            var users = await connection.QueryAsync<Reader>(selectUserSql, param: new { readerId = readerId });
            return Result<IEnumerable<Reader>>.Success(users);
        }
        catch (Exception ex)
        {
            return Result<IEnumerable<Reader>>.Failure(RepositoryErrors<Reader>.NotFoundError);
        }
    }

    public async Task<Result<bool>> UpdateReaderAsync(int readerId, ReaderDTO readerDto)
    {
        using var connection = await _connectionFactory.CreateDbConnection();

        const string selectUserSql =
            """
            UPDATE Readers 
            SET FullName = @fullName, Adress = @address, Phone = @phone FROM Readers 
            WHERE readerId = @readerId;
            """;
        try
        {
            var result = await connection.ExecuteAsync(selectUserSql,
                param: new
                {
                    readerId = readerId,
                    fullName = readerDto.FullName,
                    address = readerDto.Address,
                    phone = readerDto.Phone
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
        using var connection = await _connectionFactory.CreateDbConnection();

        const string selectUserSql =
            """
            DELETE FROM Readers 
            WHERE userId = @readerId;
            """;
        try
        {
            var result = await connection.ExecuteAsync(selectUserSql, param: new { readerId = readerId, });
 
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