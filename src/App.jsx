import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// pages
import Login          from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard      from "./pages/Dashboard";
import Products       from "./pages/Products";
import Categories     from "./pages/Categories";
import Inventory      from "./pages/Inventory";
import Customers      from "./pages/Customer";
import Transactions   from "./pages/Transaction";
import Reports        from "./pages/Reports";
import Users          from "./pages/Users";
import Settings       from "./pages/Settings";
import NewSale        from "./pages/NewSale";
import SubCategories  from "./pages/SubCategories";
import WH_Management  from "./pages/WHManagement";
import WH_Transfer    from "./pages/WHTransfer";

function App() {
  return (
    <Router>
      <Routes>
        {/* redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* auth routes (no layout) */}
        <Route path="/login"           element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* app routes with layout — outer guard: must be logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* ── Cashier + Admin ── */}
          <Route path="sale" element={<NewSale />} />

          {/* ── Admin only ── */}
          <Route path="dashboard"      element={<ProtectedRoute adminOnly><Dashboard    /></ProtectedRoute>} />
          <Route path="products"       element={<ProtectedRoute adminOnly><Products     /></ProtectedRoute>} />
          <Route path="categories"     element={<ProtectedRoute adminOnly><Categories   /></ProtectedRoute>} />
          <Route path="sub-categories" element={<ProtectedRoute adminOnly><SubCategories/></ProtectedRoute>} />
          <Route path="WH_management"  element={<ProtectedRoute adminOnly><WH_Management/></ProtectedRoute>} />
          <Route path="WH_transfer"    element={<ProtectedRoute adminOnly><WH_Transfer  /></ProtectedRoute>} />
          <Route path="inventory"      element={<ProtectedRoute adminOnly><Inventory    /></ProtectedRoute>} />
          <Route path="customers"      element={<ProtectedRoute adminOnly><Customers    /></ProtectedRoute>} />
          <Route path="transactions"   element={<ProtectedRoute adminOnly><Transactions /></ProtectedRoute>} />
          <Route path="reports"        element={<ProtectedRoute adminOnly><Reports      /></ProtectedRoute>} />
          <Route path="users"          element={<ProtectedRoute adminOnly><Users        /></ProtectedRoute>} />
          <Route path="settings"       element={<ProtectedRoute adminOnly><Settings     /></ProtectedRoute>} />
        </Route>

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;