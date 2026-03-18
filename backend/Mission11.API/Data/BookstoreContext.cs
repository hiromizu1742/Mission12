using BookstoreApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Data;

// Database context used by Entity Framework Core to query/update bookstore data.
public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

    // Represents the Books table in the SQLite database.
    public DbSet<Book> Books { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Map the Book entity explicitly to the "Books" table.
        modelBuilder.Entity<Book>().ToTable("Books");
    }
}
