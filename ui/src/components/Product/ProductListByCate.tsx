import React from 'react';
import styled from 'styled-components';

// Kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
}

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

// Component hiển thị danh sách sản phẩm
const ProductListByCate = () => {

  const products: Product[] = [
    {
      id: 1,
      name: 'Áo sơ mi trắng',
      imageUrl: 'https://via.placeholder.com/150',
      price: 300000,
      description: 'Áo sơ mi chất liệu cao cấp, phong cách thanh lịch.',
    },
    {
      id: 2,
      name: 'Quần jeans xanh',
      imageUrl: 'https://via.placeholder.com/150',
      price: 500000,
      description: 'Quần jeans thời trang, phù hợp với mọi phong cách.',
    },
    {
      id: 3,
      name: 'Áo thun đen',
      imageUrl: 'https://via.placeholder.com/150',
      price: 200000,
      description: 'Áo thun cotton mềm mại, dễ chịu.',
    },
    {
      id: 4,
      name: 'Giày thể thao',
      imageUrl: 'https://via.placeholder.com/150',
      price: 700000,
      description: 'Giày thể thao chất lượng cao, êm ái khi di chuyển.',
    },
  ];

  return (
    <Container>
      <CategoryTitle>{'Category Name'}</CategoryTitle>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price}</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </Container>
  );
};

export default ProductListByCate;

