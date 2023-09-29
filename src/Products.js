import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = ({ products, cartItems, createLineItem, addLineItem, setProducts })=> {
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdDesc, setNewProdDesc] = useState("");

  const createProduct = async(ev)=> {
    ev.preventDefault();
    const product = {
      name: newProdName,
      price: newProdPrice,
      description: newProdDesc
    };
    const { data } = await axios.post('/api/products', product);
    setProducts([...products, data])
  }

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={createProduct}>
        <input type="text" placeholder="Product name" value={newProdName} onChange={ev => setNewProdName(ev.target.value)}/>
        <input type="number" placeholder="Product price" value={newProdPrice} onChange={ev => setNewProdPrice(ev.target.value)}/>
        <input type="text" placeholder="Product description" value={newProdDesc} onChange={ev => setNewProdDesc(ev.target.value)}/>
        <button>Create product</button>
      </form>
      <ul>
        {
          products.map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={ product.id }>
                { `Name: ${product.name} Price: ${product.price ? `$${(product.price/100).toFixed(2)}` : "free"}` }
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
    </div>
  );
};

export default Products;
