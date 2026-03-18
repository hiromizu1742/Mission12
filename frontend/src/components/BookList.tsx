import { useEffect, useState } from 'react';

// Matches the JSON shape returned by the backend API.
interface Book {
  bookID: number; // Uses camelCase because backend JSON is configured to camelCase.
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

export default function BookList() {
  // Local UI state for data, paging, and sorting.
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalBooks, setTotalBooks] = useState(0);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Reload books whenever paging or sorting changes.
    fetch(`/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}`)
      .then(r => r.json())
      .then(data => {
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      });
  }, [pageNum, pageSize, sortOrder]);

  const totalPages = Math.ceil(totalBooks / pageSize);

  return (
    <div className="container mt-4">
      <h2>📚 Bookstore</h2>

      {/* Sort order and page-size controls. */}
      <div className="d-flex gap-3 mb-3">
        <select className="form-select w-auto"
          value={sortOrder}
          onChange={e => { setSortOrder(e.target.value); setPageNum(1); }}>
          <option value="asc">Title: A → Z</option>
          <option value="desc">Title: Z → A</option>
        </select>

        <select className="form-select w-auto"
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPageNum(1); }}>
          {[5, 10, 20].map(n => (
            <option key={n} value={n}>Show {n}</option>
          ))}
        </select>
      </div>

      {/* Book data table. */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Title</th><th>Author</th><th>Publisher</th>
            <th>ISBN</th><th>Category</th><th>Pages</th><th>Price</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>${b.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination buttons based on total page count. */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPageNum(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
