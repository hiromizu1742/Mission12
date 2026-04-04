import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminBooks from './components/AdminBooks';

// Wrapper reads URL params so CartPage knows where to send the user back.
function CartPageWrapper() {
  const [searchParams] = useSearchParams();
  const returnPage = Number(searchParams.get('returnPage')) || 1;
  const returnCategory = searchParams.get('returnCategory') || '';
  return <CartPage returnPage={returnPage} returnCategory={returnCategory} />;
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPageWrapper />} />
          <Route path="/adminbooks" element={<AdminBooks />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
