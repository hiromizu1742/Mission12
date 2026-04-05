using BookstoreApp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "FrontendDevPolicy";

// Register Entity Framework Core with the SQLite database file.
var publishedDbPath = Path.Combine(builder.Environment.ContentRootPath, "Bookstore.sqlite");
var localDbPath = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, "..", "Bookstore.sqlite"));
var dbPath = File.Exists(publishedDbPath) ? publishedDbPath : localDbPath;
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Allow local frontend and Azure Static Web App frontend to call this API.
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "https://thankful-water-0ae24d31e.1.azurestaticapps.net")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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
app.UseCors(FrontendCorsPolicy);
app.UseAuthorization();
app.MapControllers();
app.Run();
