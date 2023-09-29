import React from 'react';

const Orders = ({ orders, products, lineItems })=> {
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {
          orders.filter(order => !order.is_cart).map( order => {
            const orderLineItems = lineItems.filter(lineItem => lineItem.order_id === order.id);
            let orderPrice = 0;
            return (
              <li key={ order.id }>
                ({ new Date(order.created_at).toLocaleString() })
                <ul>
                  {
                    orderLineItems.map( lineItem => {
                      const product = products.find(product => product.id === lineItem.product_id);
                      const totalPrice = lineItem.quantity * product.price;
                      orderPrice += totalPrice;
                      return (
                        <li key={ lineItem.id }>
                          { product ? `${product.name}(${lineItem.quantity}) for $${(totalPrice/100).toFixed(2)}!`: '' }
                        </li>
                      );
                    })
                  }
                </ul>
                {`For a total of: $${(orderPrice/100).toFixed(2)}!`}
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Orders;
