import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import BillPage from "./pages/BillPage";
import CustomerPage from "./pages/CustomerPage";
import StatisticPage from "./pages/StatisticPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ProductPage from "./pages/ProductPage";
import { useSelector } from "react-redux";
import { useEffect } from "react";


function App() {

  const cart = useSelector((state)=> state.cart)

  useEffect(()=> {
    localStorage.setItem("cart", JSON.stringify(cart))
  },[cart])
  return (
    <BrowserRouter>
      <Routes>
        <Route
        path="/" 
        element={<Navigate to="/home"/>} 
        />
        <Route
        path="/home" 
        element={<RouteControl><HomePage/></RouteControl>} 
        />
        <Route
        path="/cart" 
        element={<RouteControl><CartPage /></RouteControl>} 
        />
        <Route
        path="/bills" 
        element={<RouteControl><BillPage /></RouteControl>} 
        />
        <Route
        path="/customers" 
        element={<RouteControl><CustomerPage /></RouteControl>} 
        />
        <Route
        path="/statistic" 
        element={<RouteControl><StatisticPage /></RouteControl>} 
        />
        <Route
        path="/products" 
        element={<RouteControl><ProductPage /></RouteControl>} 
        />        
        <Route
        path="/register" 
        element={<Register />}
        />
        <Route 
        path="/login" 
        element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


export const RouteControl = ({children}) => {
  if(localStorage.getItem("posUser")){
    return children;
  }else{
    return <Navigate to="/login"></Navigate>
  }
}