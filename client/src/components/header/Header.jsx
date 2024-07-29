import React from 'react';
import { Input, Badge, message } from 'antd';
import { SearchOutlined, HomeOutlined, ShoppingCartOutlined, CopyOutlined, UserOutlined, BarChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "./index.css";
import { useSelector } from "react-redux";

const Header = ({ setSearch }) => {
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { pathname } = useLocation();
    const logOut = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            localStorage.removeItem("posUser");
            navigate("/login");
            message.success("Çıkış işlemi başarılı");
        }
    }

    return (
        <div className='border-b mb-6'>
            <header className='py-4 px-6 flex justif-between items-center gap-10'>
                <div className="logo">
                    <Link to="/home">
                        <h2 className='text-2xl font-bold md:text-4xl'>LOGO</h2>
                    </Link>
                </div>

                <div
                    className="header-search flex-1 flex justify-center "
                    onClick={() => {
                        pathname !== "/home" && navigate("/home")
                    }}
                >

                    <Input
                        size="large"
                        placeholder="Ürün Ara..."
                        prefix={<SearchOutlined />}
                        className='rounded-full max-w-[800px]'
                        onChange={(e) => {
                            if (pathname !== "/home") {
                                navigate("/home")
                            } else {
                                setSearch(e.target.value.toLowerCase())
                            }
                        }}

                    />

                </div>
                <div className="menu-links">
                    <Link to={"/home"} className={`menu-link ${
                       pathname === "/home" && "active" 
                    }`}>
                        <HomeOutlined className='md:text-2xl text-xl' />
                        <span className='text-[10px] md:text-[10px]'>Ana Sayfa</span>
                    </Link>
                    <Badge count={cart.cartItems.length} offset={[0, 1]} className='md:flex hidden' >
                        <Link to={"/cart"} className={`menu-link ${
                       pathname === "/cart" && "active" 
                    }`}>
                            <ShoppingCartOutlined className='text-2xl' />
                            <span className='text-[10px] md:text-[10px]'>Sepet</span>
                        </Link>
                    </Badge>


                    <Link to={"/bills"} className={`menu-link ${
                       pathname === "/bills" && "active" 
                    }`}>
                        <CopyOutlined className='md:text-2xl text-xl' />
                        <span className='text-[10px] md:text-[10px]'>Faturalar</span>
                    </Link>


                    <Link to={"/customers"} className={`menu-link ${
                       pathname === "/customers" && "active" 
                    }`}>
                        <UserOutlined className='md:text-2xl text-xl' />
                        <span className='text-[10px] md:text-[10px]'>Müşteriler</span>
                    </Link>
                    <Link to={"/statistic"} className={`menu-link ${
                       pathname === "/statistic" && "active" 
                    }`}>
                        <BarChartOutlined className='md:text-2xl text-xl' />
                        <span className='text-[10px] md:text-[10px]'>İstatistikler</span>
                    </Link>
                    <div onClick={logOut}>
                        <Link className='menu-link'>
                            <LogoutOutlined className='md:text-2xl text-xl' />
                            <span className='text-[10px] md:text-[10px]'>Çıkış</span>
                        </Link>
                    </div>
                </div>
                <Badge count={cart.cartItems.length} offset={[0, 1]} className='md:hidden flex'>
                    <Link to={"/cart"} className={`menu-link ${
                       pathname === "/cart" && "active" 
                    }`}>
                        <ShoppingCartOutlined className='text-2xl' />
                        <span className='text-[10px] md:text-[10px]'>Sepet</span>
                    </Link>
                </Badge>
            </header>
        </div>
    );
};


export default Header;