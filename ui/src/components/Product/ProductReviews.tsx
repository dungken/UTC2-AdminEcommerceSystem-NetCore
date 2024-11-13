import React from 'react';
import styled from 'styled-components';

interface ProductReviewsProps {
    productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
    // Placeholder for reviews data
    const reviews = [
        { id: 1, user: 'John Doe', comment: 'Great product!', rating: 5 },
        { id: 2, user: 'Jane Smith', comment: 'Good value for money.', rating: 4 },
    ];

    return (
        <ReviewsContainer>
            <h4>Customer Reviews</h4>
            {reviews.map((review) => (
                <ReviewCard key={review.id}>
                    <p><strong>{review.user}</strong></p>
                    <p>{review.comment}</p>
                    <p>Rating: {review.rating} / 5</p>
                </ReviewCard>
            ))}
        </ReviewsContainer>
    );
};

const ReviewsContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ReviewCard = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

export default ProductReviews;