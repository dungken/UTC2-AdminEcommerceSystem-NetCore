import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { GetProductById } from '../../services/ProductService';


const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 1.8rem;
  color: #e74c3c;
  margin-bottom: 10px;
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const LeftColumn = styled.div``;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Description = styled.div`
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  line-height: 1.6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  img {
    width: calc(50% - 10px);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const Section = styled.div`
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 10px;
    font-size: 1rem;

    strong {
      font-weight: bold;
    }
  }
`;

const Colors = styled.div`
  display: flex;
  gap: 10px;

  span {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }
`;

const Sizes = styled.div`
  display: flex;
  gap: 10px;

  span {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.9rem;
    background-color: #f0f0f0;
  }
`;


const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>(); // Get productId from URL
  const [product, setProduct] = useState<any | null>(null);


  useEffect(() => {
    // Fetch the product details using productId
    const fetchProduct = async () => {
      try {
        const response = await GetProductById(productId);
        console.log(response.data);

        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price);



  return (
    <Container>
      <Header>
        <Title>{product.name}</Title>
        <Price>{formattedPrice}</Price>
      </Header>
      <Grid>
        <LeftColumn>
          <ImagesContainer>
            {product.images.map((image: any, index: number) => (
              <img key={index} src={image.url} alt={image.altText || 'Product Image'} />
            ))}
          </ImagesContainer>
        </LeftColumn>
        <RightColumn>
          <Section>
            <h3>Description</h3>
            <Description dangerouslySetInnerHTML={{ __html: product.description }} />
          </Section>
          <Section>
            <h3>Details</h3>
            <List>
              <li>
                <strong>Stock Quantity:</strong> {product.stockQuantity}
              </li>
              <li>
                <strong>Status:</strong> {product.status || 'N/A'}
              </li>
              <li>
                <strong>Created At:</strong>{' '}
                {new Date(product.createdAt).toLocaleDateString('en-GB')}
              </li>
              <li>
                <strong>Updated At:</strong>{' '}
                {new Date(product.updatedAt).toLocaleDateString('en-GB')}
              </li>
            </List>
          </Section>
          <Section>
            <h3>Colors</h3>
            <Colors>
              {product.colors.map((color: any, index: number) => (
                <span
                  key={index}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.name}
                ></span>
              ))}
            </Colors>
          </Section>
          <Section>
            <h3>Sizes</h3>
            <Sizes>
              {product.sizes.map((size: any, index: number) => (
                <span key={index}>{size.name}</span>
              ))}
            </Sizes>
          </Section>
        </RightColumn>
      </Grid>
    </Container>
  );
};

export default ProductDetail;