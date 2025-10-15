using Api.Exceptions;
using Infrastructure.Common.Email;
using Infrastructure.Data;
using Microsoft.OpenApi.Models;
using Serilog;

namespace Api.Configurations;

public static class ConfigureBuilder
{
    public static void Configure(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        
        services.AddExceptionHandler<GlobalExceptionHandler>();

        services.AddSerilog(s =>
            s.ReadFrom.Configuration(builder.Configuration));

        services.AddControllers();

        services.AddSingleton<IDBConnectionFactory>(_ => 
            new DbConnectionFactory(builder.Configuration["ConnectionStrings:DefaultConnection"]!));
        
        services.AddEndpointsApiExplorer();
        AddSwagger(builder);

        services.AddProblemDetails();
        
        services.AddHttpContextAccessor();
        services.AddScoped<IEmailService, EmailService>();
    }

    private static void AddSwagger(this WebApplicationBuilder builder)
    {
        var services = builder.Services;
        services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc("v1", new OpenApiInfo { Title = "Lexi API", Version = "v1" });
            option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            });
            option.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            });
        });
    }
}