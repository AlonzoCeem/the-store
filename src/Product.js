import React from "react";
import { useParams } from "react-router-dom";

const Product = ({ products, reviews })=> {
    const { id } = useParams();
    const product = products.find(product => product.id === id);
    const productReviews = reviews.filter(review => review.product_id === id);
    return (
        <div>
            <h2>Product: {product.name}</h2>
            <h4>Posted at: {product.created_at}</h4>
            <h4>Description:</h4>
            <p>{product.description ? product.description : "No description provided!"}</p>
            <h2>Reviews</h2>
            {
                productReviews.length ? 
                    productReviews.map(review => {
                        return (
                            <div key={review.id}>
                                <h4>{review.title}</h4>
                                <p>Posted at: {review.created_at}</p>
                                <p>{review.txt}</p>
                            </div>
                        )
                    })
                    : `No reviews are posted for ${product.name}! Be the first!`
            }
        </div>
    )
}

export default Product;