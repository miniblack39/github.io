import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerTop from "./pages/CustomerTop";
import MenuPage from "./pages/MenuPage";
//import OrderConfirm from "./pages/OrderConfirm";
//import StaffOrders from "./pages/StaffOrders";
//import CheckoutPage from "./pages/CheckoutPage";
//import FinishPage from "./pages/FinishPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* お客様用 */}
        <Route path="/c/:tableId" element={<CustomerTop />} />
        <Route path="/c/:tableId/menu" element={<MenuPage />} />
        {/* <Route path="/c/:tableId/confirm" element={<OrderConfirm />} />
        <Route path="/c/:tableId/checkout" element={<CheckoutPage />} />
        <Route path="/c/:tableId/finish" element={<FinishPage />} /> */}

        {/* スタッフ用 */}
        {/* <Route path="/staff/orders" element={<StaffOrders />} />
         */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
