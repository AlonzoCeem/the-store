const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_store_db');
const { v4 } = require('uuid');
const uuidv4 = v4;


const fetchLineItems = async()=> {
  const SQL = `
    SELECT *
    FROM line_items
    ORDER BY product_id
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async()=> {
  const SQL = `
    SELECT *
    FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReviews = async()=> {
  const SQL = `
    SELECT *
    FROM reviews
    ORDER BY product_id
  `;
  const response = await client.query(SQL);
  return response.rows;
}

const createProduct = async(product)=> {
  const SQL = `
    INSERT INTO products (id, name, price, description) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [ uuidv4(), product.name, product.price, product.description]);
  return response.rows[0];
};

const createReview = async(review)=> {
  const SQL = `
    INSERT INTO reviews (id, product_id, title, txt, rating) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuidv4(), review.product_id, review.title, review.txt, review.rating]);
  return response.rows[0];
}

const ensureCart = async(lineItem)=> {
  let orderId = lineItem.order_id;
  if(!orderId){
    const SQL = `
      SELECT order_id 
      FROM line_items 
      WHERE id = $1 
    `;
    const response = await client.query(SQL, [lineItem.id]);
    orderId = response.rows[0].order_id;
  }
  const SQL = `
    SELECT * 
    FROM orders
    WHERE id = $1 and is_cart=true
  `;
  const response = await client.query(SQL, [orderId]);
  if(!response.rows.length){
    throw Error("An order which has been placed can not be changed");
  }
};
const updateLineItem = async(lineItem)=> {
  await ensureCart(lineItem);
  SQL = `
    UPDATE line_items
    SET quantity = $1
    WHERE id = $2
    RETURNING *
  `;
  if(lineItem.quantity <= 0){
    throw Error('a line item quantity must be greater than 0');
  }
  const response = await client.query(SQL, [lineItem.quantity, lineItem.id]);
  return response.rows[0];
};

const createLineItem = async(lineItem)=> {
  await ensureCart(lineItem);
  const SQL = `
  INSERT INTO line_items (product_id, order_id, id) VALUES($1, $2, $3) RETURNING *
`;
 response = await client.query(SQL, [ lineItem.product_id, lineItem.order_id, uuidv4()]);
  return response.rows[0];
};

const deleteLineItem = async(lineItem)=> {
  await ensureCart(lineItem);
  const SQL = `
    DELETE from line_items
    WHERE id = $1
  `;
  await client.query(SQL, [lineItem.id]);
};

const updateOrder = async(order)=> {
  const SQL = `
    UPDATE orders SET is_cart = $1 WHERE id = $2 RETURNING *
  `;
  const response = await client.query(SQL, [order.is_cart, order.id]);
  return response.rows[0];
};

const fetchOrders = async()=> {
  const SQL = `
    SELECT * FROM orders;
  `;
  const response = await client.query(SQL);
  const cart = response.rows.find(row => row.is_cart);
  if(!cart){
    await client.query('INSERT INTO orders(is_cart, id) VALUES(true, $1)', [uuidv4()]); 
    return fetchOrders();
  }
  return response.rows;
};

const seed = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL,
      price INT,
      description TEXT
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE line_items(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      order_id UUID REFERENCES orders(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
    );

    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      title VARCHAR(50),
      txt VARCHAR(255),
      rating INT
    )
  `;
  await client.query(SQL);
  const [foo, bar, bazz] = await Promise.all([
    createProduct({ name: 'foo', price: 100, description: "This is a foo of alright quality! It's been well used, but still in good shape. Looking to get $1." }),
    createProduct({ name: 'bar', price: 100000, description: "Introducing the extraordinary Bar – a true masterpiece of innovation and craftsmanship that stands as a testament to uncompromising excellence. Priced at a remarkable thousand dollars, the Bar is not merely a product; it's an embodiment of luxury and sophistication. Crafted with precision and attention to detail, the Bar redefines the boundaries of what's possible in its category. Its top-of-the-line features are a testament to its unparalleled quality and performance, making it a must-have for those who demand the very best. The Bar boasts a host of cutting-edge technologies that ensure a seamless user experience. From its sleek and elegant design to its advanced functionality, every aspect of the Foo has been carefully engineered to exceed your expectations. With the Bar, you're not just buying a product; you're investing in a lifestyle of opulence and refinement. Its exceptional build quality and durability ensure that it will serve you faithfully for years to come, making it worth every cent of its thousand-dollar price tag. Don't settle for less when you can own the Bar – the pinnacle of luxury and performance in its class. Elevate your standards and experience the epitome of excellence with this top-of-the-line masterpiece."}),
    createProduct({ name: 'bazz', description: "This bazz is no longer wanted. Contact me if you want it." }),
    createProduct({ name: 'quq', price: 4000 }),
  ]);
  let orders = await fetchOrders();
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: foo.id});
  lineItem.quantity++;
  await updateLineItem(lineItem);
  cart.is_cart = false;
  await updateOrder(cart);
  await createReview({ product_id: foo.id, title: "Best Foo I've owned!", txt: "BUY IT!", rating: 5})
  await createReview({ product_id: bar.id, title: "Don't get scammed!!", txt: "This thing is a rip off!", rating: 1})
  await createReview({ product_id: bazz.id, title: "I can't believe they're handing these out!", txt: "Worth the time to pick it up!", rating: 5})
};

module.exports = {
  fetchProducts,
  fetchOrders,
  fetchLineItems,
  fetchReviews,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  createProduct,
  createReview,
  seed,
  client
};
