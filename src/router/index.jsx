/* eslint-disable react/prop-types */
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "../pages/Home/Home";
import BasicLayout from "../layout/BasicLayout";

import SignUp from "../pages/Auth/Signup";
import SignIn from "../pages/Auth/Signin";

import TrashCategory from "../pages/Category/_components/TrashCategory";
import Category from "../pages/Category/page";

import NotFound from "../pages/NotFound/NotFound";

import CreateProduct from "../pages/Product/_component/CreateProduct";
import UpdateProduct from "../pages/Product/_component/UpdateProduct";
import ProductManagePage from "../pages/Product/page";
import TrashProduct from "../pages/Product/_component/TrashProduct";
import Order from "../pages/Order/Page";
import OrderDetail from "../pages/Order/_components/OrderDetail";
import ProductAttribute from "../pages/Attribute/page";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("access") !== null;
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

const RouterComponent = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<NotFound />} />
          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <BasicLayout />
              </PrivateRoute>
            }
          >
            {/* Index */}
            <Route index element={<Home />} />

            {/* Category */}
            <Route path="categories" element={<Category />} />
            <Route path="categories/trash" element={<TrashCategory />} />

            {/* Product */}
            <Route path="products" element={<ProductManagePage />} />
            <Route path="products/add" element={<CreateProduct />} />
            <Route path="products/trash" element={<TrashProduct />} />
            <Route path="products/:id/edit" element={<UpdateProduct />} />

            {/* Product att */}
            <Route
              path="products/:id/attributes"
              element={<ProductAttribute />}
            />

            {/* Order */}
            <Route path="orders" element={<Order />} />
            <Route path="orders/:id" element={<OrderDetail />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default RouterComponent;
