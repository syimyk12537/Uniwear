import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthChange } from './firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess, signOut } from './redux/userSlice';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        dispatch(signInSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0]
        }));
      } else {
        dispatch(signOut());
        navigate('/register'); // Перенаправление на регистрацию при отсутствии пользователя
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/register" element={<AuthPage type="register" />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/" element={user ? <ProductsPage /> : <Navigate to="/register" />} />
          <Route path="/shop" element={user ? <ProductsPage /> : <Navigate to="/register" />} />
          <Route path="/product/:id" element={user ? <ProductPage /> : <Navigate to="/register" />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/register" />} />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;