using BookstoreApp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register Entity Framework Core with the SQLite database file.
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite("Data Source=/Users/hirohitomizuno/IS Project/IS 413/Mission11/backend/Bookstore.sqlite"));

// Register API controllers and force camelCase JSON for frontend compatibility.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase);

// Enable OpenAPI/Swagger endpoint generation.
builder.Services.AddOpenApi();

var app = builder.Build();

// Expose OpenAPI in local development only.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Configure middleware pipeline and map controllers.
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
