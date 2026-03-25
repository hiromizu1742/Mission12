import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface Book {
  bookID: number;
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, itemCount, total } = useCart();

  // Restore page/category from URL when returning from cart.
  const [pageNum, setPageNum] = useState(Number(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [addedBookId, setAddedBookId] = useState<number | null>(null);

  // Load categories once on mount.
  useEffect(() => {
    fetch('/api/books/categories')
      .then(r => r.json())
      .then(setCategories);
  }, []);

  // Reload books whenever paging, sorting, or category changes.
  useEffect(() => {
    const categoryParam = selectedCategory
      ? `&category=${encodeURIComponent(selectedCategory)}`
      : '';
    fetch(
      `/api/books?pageNum=${pageNum}&pageSize=${pageSize}&sortOrder=${sortOrder}${categoryParam}`
    )
      .then(r => r.json())
      .then(data => {
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
      });
  }, [pageNum, pageSize, sortOrder, selectedCategory]);

  const totalPages = Math.ceil(totalBooks / pageSize);

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    setPageNum(1); // reset to page 1 when filter changes
  }

  function handleAddToCart(book: Book) {
    addItem({ bookID: book.bookID, title: book.title, price: book.price });
    setAddedBookId(book.bookID);
    setTimeout(() => setAddedBookId(null), 1200);
  }

  function goToCart() {
    navigate(`/cart?returnPage=${pageNum}&returnCategory=${encodeURIComponent(selectedCategory)}`);
  }

  return (
    <div className="container-fluid mt-4">
      {/* ── Top bar with title and cart summary ── */}
      <div className="row align-items-center mb-3">
        <div className="col">
          <h2 className="mb-0">📚 Bookstore</h2>
        </div>
        <div className="col-auto">
          {/* Cart summary button with badge — new Bootstrap feature #1 */}
          <button className="btn btn-outline-dark position-relative" onClick={goToCart}>
            🛒 Cart
            {itemCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {itemCount}
              </span>
            )}
          </button>
          {itemCount > 0 && (
            <span className="ms-3 text-muted small">
              {itemCount} item{itemCount !== 1 ? 's' : ''} — ${total.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="row">
        {/* ── Category sidebar ── */}
        <div className="col-md-2">
          {/* list-group used for category filter — discussed in assignment comment */}
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`list-group-item list-group-item-action ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main content area ── */}
        <div className="col-md-10">
          {/* Sort / page-size controls */}
          <div className="d-flex gap-3 mb-3">
            <select
              className="form-select w-auto"
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value);
                setPageNum(1);
              }}
            >
              <option value="asc">Title: A → Z</option>
              <option value="desc">Title: Z → A</option>
            </select>

            <select
              className="form-select w-auto"
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPageNum(1);
              }}
            >
              {[5, 10, 20].map(n => (
                <option key={n} value={n}>
                  Show {n}
                </option>
              ))}
            </select>

            {selectedCategory && (
              <span className="badge bg-secondary align-self-center fs-6">
                {selectedCategory}
                <button
                  className="btn-close btn-close-white ms-2"
                  style={{ fontSize: '0.6rem' }}
                  onClick={() => handleCategoryChange('')}
                  aria-label="Clear filter"
                />
              </span>
            )}
          </div>

          {/* Book table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Pages</th>
                  <th>Price</th>
                  <th></th>
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
                    <td>
                      <button
                        className={`btn btn-sm ${addedBookId === b.bookID ? 'btn-success' : 'btn-outline-primary'}`}
                        onClick={() => handleAddToCart(b)}
                      >
                        {addedBookId === b.bookID ? '✓ Added' : 'Add to Cart'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
      </div>
    </div>
  );
}
