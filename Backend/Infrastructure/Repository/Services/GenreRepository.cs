using Dapper;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class GenreRepository : IGenreRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public GenreRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result<IEnumerable<Genre>>> GetGenresAsync()
    {
        const string selectGenresSql = "SELECT GenreID, GenreName, Description FROM Genres ORDER BY GenreName";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var genres = await connection.QueryAsync<Genre>(selectGenresSql);
            return Result<IEnumerable<Genre>>.Success(genres);
        }
        catch (SqlException ex)
        {
            return Result<IEnumerable<Genre>>.Failure(RepositoryErrors<Genre>.NotFoundError);
        }
    }
}

