namespace Api.Configurations;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        var config = app.Configuration;

        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        
        app.UseRouting();
        
        app.UseCors(options =>
        {
            options
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
                .WithOrigins(config.GetSection("ApplicationURLs")["FrontEnd"] ?? "monkey sigma");
        });
        
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
    }
}