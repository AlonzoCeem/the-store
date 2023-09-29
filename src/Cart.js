import React from 'react';

const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products, addLineItem, subtractLineItem })=> {
  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {
          lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ?
            lineItems.filter(lineItem=> lineItem.order_id === cart.id).map( lineItem => {
              const product = products.find(product => product.id === lineItem.product_id) || {};
              return (
                <li key={ lineItem.id }>
                  { product.name }
                  ({ lineItem.quantity })
                  <button onClick={ ()=> addLineItem(lineItem)}>+</button>
                  {
                    lineItem.quantity > 1 ? <button onClick={ ()=> subtractLineItem(lineItem)}>-</button> : ""
                  }
                  <button onClick={ ()=> removeFromCart(lineItem)}>Remove From Cart</button>
                </li>
              );
            })
          : "Add some items to your cart!" 
        }
      </ul>
      {
        lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <button onClick={()=> {
          updateOrder({...cart, is_cart: false });
        }}>Create Order</button>: null
      }
    </div>
  );
};

export default Cart;
