using Dapper;
using Domain.Models;
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
        
        var users = await connection.QueryAsync<Reader>(selectUsersSql);
        
        return Result<IEnumerable<Reader>>.Success(users);
    }
}