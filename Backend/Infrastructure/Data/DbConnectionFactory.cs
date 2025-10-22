using System.Data;
using Microsoft.Data.SqlClient;

namespace Infrastructure.Data;

public class DbConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<IDbConnection> CreateDbConnection(CancellationToken cancellationToken = default)
    {
        var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        
        return connection;
    }
}

public interface IDbConnectionFactory
{
    Task<IDbConnection> CreateDbConnection(CancellationToken cancellationToken = default);
}