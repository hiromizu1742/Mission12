using BookstoreApp.Data;
using BookstoreApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Controllers;

[ApiController]
[Route("api/[controller]")]
// API endpoints for browsing books with paging and sorting.
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks(
        int pageNum = 1,
        int pageSize = 5,
        string sortOrder = "asc",
        string? category = null)
    {
        // Start with the full books query so filters/sorts can be chained.
        var query = _context.Books.AsQueryable();

        // Filter by category if one is specified.
        if (!string.IsNullOrEmpty(category))
            query = query.Where(b => b.Category == category);

        // Sort by title in ascending or descending order.
        query = sortOrder == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        // Count all rows after sorting/filtering for pagination metadata.
        var totalBooks = await query.CountAsync();

        // Return only the requested page.
        var books = await query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Keep payload shape simple for the frontend.
        return Ok(new
        {
            books,
            totalBooks,
            pageNum,
            pageSize
        });
    }

    // Returns the distinct category names for building the filter sidebar.
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(AddBook), new { id = book.BookID }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
    {
        if (id != book.BookID)
            return BadRequest();

        var existing = await _context.Books.FindAsync(id);
        if (existing == null)
            return NotFound();

        _context.Entry(existing).CurrentValues.SetValues(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
