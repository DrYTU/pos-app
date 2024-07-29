import React, { useEffect, useState } from 'react'
import CartTotal from "../components/cart/CartTotal";
import Categories from "../components/categories/Categories";
import Header from "../components/header/Header";
import Products from "../components/products/Products";
import { Spin } from 'antd';

const HomePage = () => {
  const [products, setProducts] = useState();
  const [categories, setCategories] = useState();
  const [filtered, setFiltered] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL+"/api/products/get-all");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL+"/api/categories/get-all");
        const data = await res.json();

        data && setCategories(data.map((item) => {
          return { ...item, value: item.title }
        }));
      } catch (error) {
        console.log(error)
      }
    };
    getCategories();
  }, [])


  return (
    <>
      <Header  setSearch={setSearch}/>
      {products && categories ? (
        <div className="home px-6 flex md:flex-row flex-col justify-between gap-10 pb-24 h-screen">
        <div className="categories overflow-y-auto max-h-[calc(100vh_-_112px)] md:pb-10 md:mr-0 mr-[20px]">
          <Categories categories={categories} setCategories={setCategories} setFiltered={setFiltered} products={products} />
        </div>

        <div className="products flex-[8] overflow-y-auto max-h-[calc(100vh_-_112px)] min-h-[500px]">
          <Products search={search} categories={categories} filtered={filtered} products={products} setProducts={setProducts} />
        </div>

        <div className="cart-wrapper min-w-[300px] md:-mr-[24px] md:-mt-[24px] border">
          <CartTotal />
        </div>
      </div>) : <Spin size="large" className='absolute top-1/2 w-screen flex item-center justify-center' />}
    </>
  )
}

export default HomePage;