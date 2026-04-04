import { useEffect, useState } from 'react';

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

const emptyBook: Omit<Book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Omit<Book, 'bookID'>>(emptyBook);
  const [showAddForm, setShowAddForm] = useState(false);
  // Bootstrap feature #1: loading spinner state
  const [loading, setLoading] = useState(true);
  // Bootstrap feature #2: dismissible alert state
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  function loadBooks() {
    setLoading(true);
    fetch('/api/books?pageSize=1000')
      .then(r => r.json())
      .then(data => {
        setBooks(data.books);
        setLoading(false);
      });
  }

  function showAlert(msg: string) {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  }

  function handleDelete(id: number) {
    if (!confirm('Delete this book?')) return;
    fetch(`/api/books/${id}`, { method: 'DELETE' }).then(() => {
      showAlert('Book deleted successfully.');
      loadBooks();
    });
  }

  function handleEditSave() {
    if (!editingBook) return;
    fetch(`/api/books/${editingBook.bookID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingBook),
    }).then(() => {
      setEditingBook(null);
      showAlert('Book updated successfully.');
      loadBooks();
    });
  }

  function handleAdd() {
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    }).then(() => {
      setNewBook(emptyBook);
      setShowAddForm(false);
      showAlert('Book added successfully.');
      loadBooks();
    });
  }

  function handleEditChange(field: keyof Book, value: string | number) {
    if (!editingBook) return;
    setEditingBook({ ...editingBook, [field]: value });
  }

  function handleNewChange(field: keyof Omit<Book, 'bookID'>, value: string | number) {
    setNewBook(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin — Manage Books</h2>
        <button className="btn btn-success" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {/* Bootstrap feature #2: Dismissible Alert — shown after add/edit/delete */}
      {alertMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {alertMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlertMsg(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Add Book Form */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header fw-bold">New Book</div>
          <div className="card-body">
            <BookForm book={newBook} onChange={handleNewChange} />
            <button className="btn btn-primary mt-2" onClick={handleAdd}>
              Save Book
            </button>
          </div>
        </div>
      )}

      {/* Edit Book Form */}
      {editingBook && (
        <div className="card mb-4 border-warning">
          <div className="card-header fw-bold bg-warning">Editing: {editingBook.title}</div>
          <div className="card-body">
            <BookForm book={editingBook} onChange={handleEditChange} />
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={handleEditSave}>
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingBook(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap feature #1: Spinner — shown while books are loading */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
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
                <th>Actions</th>
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
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => setEditingBook(b)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(b.bookID)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Shared form fields for add and edit
function BookForm({
  book,
  onChange,
}: {
  book: Omit<Book, 'bookID'> | Book;
  onChange: (field: any, value: string | number) => void;
}) {
  const fields: { key: keyof Omit<Book, 'bookID'>; label: string; type?: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'publisher', label: 'Publisher' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'classification', label: 'Classification' },
    { key: 'category', label: 'Category' },
    { key: 'pageCount', label: 'Page Count', type: 'number' },
    { key: 'price', label: 'Price', type: 'number' },
  ];

  return (
    <div className="row g-2">
      {fields.map(f => (
        <div className="col-md-3" key={f.key}>
          <label className="form-label small mb-0">{f.label}</label>
          <input
            className="form-control form-control-sm"
            type={f.type || 'text'}
            step={f.type === 'number' ? 'any' : undefined}
            value={(book as any)[f.key]}
            onChange={e =>
              onChange(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
}
