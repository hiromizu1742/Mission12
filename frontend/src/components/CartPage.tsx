import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  returnPage: number;
  returnCategory: string;
}

export default function CartPage({ returnPage, returnCategory }: CartPageProps) {
  const { items, removeItem, updateQty, total } = useCart();
  const navigate = useNavigate();

  function handleContinueShopping() {
    navigate(`/?page=${returnPage}&category=${encodeURIComponent(returnCategory)}`);
  }

  if (items.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <h2>Your Cart is Empty</h2>
            <p className="text-muted">Add some books to get started!</p>
            <button className="btn btn-primary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {/* Bootstrap breadcrumb — new Bootstrap feature #2 */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={handleContinueShopping}
                >
                  Bookstore
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Shopping Cart
              </li>
            </ol>
          </nav>

          <h2 className="mb-4">Shopping Cart</h2>

          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Book</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.bookID}>
                    <td>{item.title}</td>
                    <td className="text-center">${item.price.toFixed(2)}</td>
                    <td className="text-center" style={{ width: '130px' }}>
                      <input
                        type="number"
                        className="form-control form-control-sm text-center"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQty(item.bookID, Number(e.target.value))}
                      />
                    </td>
                    <td className="text-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.bookID)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-secondary fw-bold">
                  <td colSpan={3} className="text-end">Order Total:</td>
                  <td className="text-center">${total.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-outline-primary" onClick={handleContinueShopping}>
              ← Continue Shopping
            </button>
            <button className="btn btn-success">Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
