import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Products = ({ products, cartItems, createLineItem, addLineItem, setProducts, lineItems })=> {
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");

  const createProduct = async(ev)=> {
    ev.preventDefault();
    const product = {
      name: newProdName,
      price: newProdPrice,
      description: newProdDesc
    };
    const { data } = await axios.post('/api/products', product);
    setProducts([...products, data]);
  };

  console.log(lineItems)
  const dict = lineItems.reduce((acc, item)=> {
    acc[item.product_id] = acc[item.product_id] || 0;
    acc[item.product_id] += item.quantity;
    return acc;
  }, {});
  const max = Math.max(...Object.values(dict));
  const entries = Object.entries(dict);
  const popularIds = entries.filter(entry => entry[1] === max).map(entry => entry[0])
  const popular = products.filter(product => popularIds.includes(product.id))

  return (
    <div>
      <h2>Products</h2>
      <h4>Our most popular product(s): 
        {
          popular.map(product => {
            return (
            <strong key={product.id}> {product.name} </strong>
            )
          })
        }
      </h4>
      <hr/>
      <h4>Create a product</h4>
      <form onSubmit={createProduct}>
        <input type="text" placeholder="Product name" value={newProdName} onChange={ev => setNewProdName(ev.target.value)}/><br/>
        <input type="number" placeholder="Product price" value={newProdPrice} onChange={ev => setNewProdPrice(ev.target.value)}/><br/>
        <input type="text" placeholder="Product description" value={newProdDesc} onChange={ev => setNewProdDesc(ev.target.value)}/><br/>
        <button>Create product</button>
      </form>
      <hr/>
      <ul>
        {
          products.map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={ product.id }>
                <Link to={`/products/${product.id}`}>{`Name: ${product.name}`}</Link>
                {` Price: ${product.price ? `$${(product.price/100).toFixed(2)}` : "free"}` }
                <br/>
                {`Description: ${product.description ? product.description.substr(0, 101) : "No description provided!"}`}
                <br/>
                {
                  cartItem ? <button onClick={ ()=> addLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add</button>
                }
              </li>
            );
          })
        }
      </ul>
      <hr/>
    </div>
  );
};

export default Products;
