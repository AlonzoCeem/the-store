# the store 

- npm install
- modify connection string
- create database
- npm run start:dev
- npm run build:dev

# requirements

- [X] Display the products name in alphabetical order
- [X] A product should have a price which is an integer (a 1 dollar item should have a product price of 100)
- [X] The price should be displayed next to the product in the products section in a currency format (a product with a price of 100 should display a price of $1.00)
- [X] A product should have a description. The description can be lengthy. The datatype should be TEXT.
- [X] The first 100 characters of the description should be shown under the product in the products section.
- [X] Show the quantity of the line items in the orders section.
- [X] The total value of the items in the cart should be shown in the cart section.
- [X] If no items are in the cart, a message should appear which states "Add some items to your cart".
- [X] A user should be able to add a new product by entering a name, description, and a price in a form in the products section.
- [X] A reviews section should be added. Each review will belong to a product. A review should have a column called txt which take a max of 255 characters. It should also have a rating column which is an INTEGER. Ratings should be from 1 to 5. (seed data for reviews)
- [X] The reviews in review section should be grouped by product.
- [X] A user should be able to increment and decrement the number of items in their carts.
- [X] The site should allow users to display each section separately.
  - [X] /products should show products
  - [X] /cart should show the cart
  - [X] /orders should show the orders
  - [X] /reviews should show the reviews 
  - [X] /products/:id should show the full products description and the reviews for that product
- [X] Display the most popular product based on the number of times it has been sold.
- [ ] Deploy
