import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { Product } from './types'; // Adjust the path to where the Product type is located
import { GetProductsByCategory } from '../../services/ProductService';

// Component that fetches and displays products by category
const ProductListByCate = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await GetProductsByCategory(categoryId);
        console.log(response.data);

        setProducts(response.data);  // Assuming data is in the format of Product[]
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]); // Refetch when categoryId changes

  if (loading) return <LoadingMessage>Loading...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!products.length) return <NoProductsMessage>No products available in this category.</NoProductsMessage>;


  const ShortDescription = ({ description }: { description: string }) => {
    const maxLength = 20;
    // Truncate description to maxLength and append "..." if it's longer
    const shortenedDescription = description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;

    return <ProductDescription dangerouslySetInnerHTML={{ __html: shortenedDescription }} />;
  };


  return (
    <Container>
      <CategoryTitle>Product List</CategoryTitle>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImage src={product.images[0]?.url || 'https://via.placeholder.com/300'} alt={product.name} />
            <ProductInfo>
              <ProductName><Link to={`/product-detail/${product.id}`}>{product.name}</Link></ProductName>
              <div className="row my-2">
                <div className="col-md-7">
                  <ProductPrice>
                    Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </ProductPrice>
                </div>
                <div className="col-md-4">
                  <ProductPrice>Stock: {`${product.stock ?? 1}`}</ProductPrice>
                </div>
              </div>
              {/* <ShortDescription description={product.description} /> */}
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

export default ProductListByCate;



const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryTitle = styled.h2`
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 1.2em;
  color: #333;
  margin: 0;
  text-align: center;
`;

const ProductPrice = styled.p`
  font-size: 1em;
  color: #f76c6c;
  font-weight: bold;
`;

const ProductDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin-top: 10px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5em;
  color: #333;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.5em;
  color: red;
`;

const NoProductsMessage = styled.div`
  text-align: center;
  font-size: 1.5em;
  color: #333;
`;