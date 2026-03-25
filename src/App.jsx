import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerTop from "./pages/CustomerTop";
import MenuPage from "./pages/MenuPage";
//import OrderConfirm from "./pages/OrderConfirm";
import StaffOrders from "./pages/StaffOrders";
import CheckoutPage from "./pages/CheckoutPage";
import FinishPage from "./pages/FinishPage";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter basename="/">
        <Routes>
          {/* お客様用 */}
          <Route path="/c/:tableId" element={<CustomerTop />} />
          <Route path="/c/:sessionId/menu" element={<MenuPage />} />
          <Route path="/c/:sessionId/finish" element={<FinishPage />} />
          <Route path="/c/:sessionId/checkout" element={<CheckoutPage />} />

          {/* スタッフ用 */}
          <Route path="/staff/orders" element={<StaffOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
