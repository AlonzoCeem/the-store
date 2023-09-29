import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { Link, HashRouter, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import Cart from './Cart';
import Reviews from './Reviews'
import Product from './Product';

const App = ()=> {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(()=> {
    const fetchData = async()=> {
      const {data} = await axios.get('/api/products');
      const sortedNames = data.map(product => product.name).sort()
      const sortedProducts = sortedNames.map(name => {
        return data.find(product => {
          if(product.name === name){
            return product
          }
        })
      })
      setProducts(sortedProducts)
    };
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/lineItems');
      setLineItems(response.data);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      const response = await axios.get('/api/reviews');
      setReviews(response.data);
    };
    fetchData();
  }, []);

  const cart = orders.find(order => order.is_cart);
  if(!cart){
    return null;
  }

  const createLineItem = async(product)=> {
    const response = await axios.post('/api/lineItems', {
      order_id: cart.id,
      product_id: product.id
    });
    setLineItems([...lineItems, response.data]);
  };

  const addLineItem = async(lineItem)=> {
    const response = await axios.put(`/api/lineItems/${lineItem.id}`, {
      quantity: lineItem.quantity + 1,
      order_id: cart.id
    });
    setLineItems(lineItems.map( lineItem => lineItem.id == response.data.id ? response.data: lineItem));
  };

  const subtractLineItem = async(lineItem)=> {
    const response = await axios.put(`/api/lineItems/${lineItem.id}`, {
      quantity: lineItem.quantity - 1,
      order_id: cart.id
    });
    setLineItems(lineItems.map( lineItem => lineItem.id == response.data.id ? response.data: lineItem));
  };

  const updateOrder = async(order)=> {
    await axios.put(`/api/orders/${order.id}`, order);
    const response = await axios.get('/api/orders');
    setOrders(response.data);
  };

  const removeFromCart = async(lineItem)=> {
    const response = await axios.delete(`/api/lineItems/${lineItem.id}`);
    setLineItems(lineItems.filter( _lineItem => _lineItem.id !== lineItem.id));
  };

  const cartItems = lineItems.filter(lineItem => lineItem.order_id === cart.id);

  const cartCount = cartItems.reduce((acc, item)=> {
    return acc += item.quantity;
  }, 0);

  return (
    <div>
      <nav>
        <Link to='/'>Show All</Link> |
        <Link to='/products'>Products ({ products.length })</Link> |
        <Link to='/orders'>Orders ({ orders.filter(order => !order.is_cart).length })</Link> |
        <Link to='/cart'>Cart ({ cartCount })</Link> |
        <Link to='/reviews'>Reviews ({reviews.length})</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <main>
            <Products products={ products } cartItems = { cartItems } createLineItem = { createLineItem } addLineItem = { addLineItem } setProducts= { setProducts } />
            <Cart cart = { cart } lineItems = { lineItems } products = { products } updateOrder = { updateOrder } removeFromCart = { removeFromCart } addLineItem = { addLineItem } subtractLineItem = { subtractLineItem }/>
            <Orders orders = { orders } products = { products } lineItems = { lineItems } />
            <Reviews reviews = { reviews } products={ products }/>
          </main>
        }/>
        <Route path="/products" element={<Products products={ products } cartItems = { cartItems } createLineItem = { createLineItem } addLineItem = { addLineItem } setProducts= { setProducts }/>}/>
        <Route path="/cart" element={<Cart cart = { cart } lineItems = { lineItems } products = { products } updateOrder = { updateOrder } removeFromCart = { removeFromCart } addLineItem = { addLineItem } subtractLineItem = { subtractLineItem } />}/>
        <Route path="/orders" element={<Orders orders = { orders } products = { products } lineItems = { lineItems } />}/>
        <Route path="/reviews" element={<Reviews reviews = { reviews } products={ products }/>}/>
        <Route path="/products/:id" element={<Product products={ products } reviews={ reviews }/>}/>
      </Routes>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);
