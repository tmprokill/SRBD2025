using Dapper;
using Domain.DTOs;
using Domain.Models;
using Infrastructure.Common.Errors.Repository;
using Infrastructure.Common.ResultPattern;
using Infrastructure.Data;
using Infrastructure.Repository.Interfaces;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Repository.Services;

public class AuthorRepository : IAuthorRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public AuthorRepository(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<Result> AddAuthorAsync(AuthorDTO authorDto)
    {
        var addAuthorSql = "EXEC usp_Insert_Into_Authors @Pseudonym, @FirstName, @LastName";

        try
        {
            using var connection = await _connectionFactory.CreateDbConnection();
            var result = await connection.ExecuteAsync(addAuthorSql,
                param: new
                {
                    Pseudonym = authorDto.Pseudonym, 
                    FirstName = authorDto.FirstName, 
                    LastName = authorDto.LastName,
                });

            if (result != 1)
            {
                return Result.Failure(RepositoryErrors<Author>.AddError);
            }

            return Result.Success();
        }
        catch (SqlException ex)
        {
            return Result.Failure(RepositoryErrors<Author>.AddError);
        }
    }
}