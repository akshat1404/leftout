import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CartPage } from './pages/CartPage';
import { RecoverCart } from './pages/RecoverCart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/recover/:cartId" element={<RecoverCart />} />
      </Routes>
    </Router>
  );
}

export default App;
