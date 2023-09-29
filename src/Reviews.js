import React from "react";

const Reviews = ({ reviews, products })=> {
    return(
        <div>
            <h2>Reviews</h2>
            <ul>
                {   
                    products && reviews ?
                        products.map(product => {
                            const productReviews = reviews.filter(review => review.product_id === product.id);
                            return(
                                <div key={product.id}>
                                    <h3>Reviews for: {product.name}</h3>
                                    {
                                        productReviews.length ? 
                                            productReviews.map(review => {
                                                return (
                                                    <div key={review.id}>
                                                        <h4>{review.title} ({review.rating} out of 5 stars)</h4>
                                                        <p>{review.txt}</p>
                                                    </div>
                                                )
                                            })
                                        : "No reviews!"
                                    }
                                </div>
                            )
                        })
                    : "Loading..."
                }
            </ul>
        </div>
    )
}

export default Reviews