import React from 'react';
import styled from 'styled-components';
import { Product } from '../Order/types';
// import { Product } from './ProductManagement';

interface ProductImagesProps {
  product: Product;
}

const ProductImages: React.FC<ProductImagesProps> = ({ product }) => {
  return (
    <ImagesContainer>
      <h4>Manage Product Images</h4>
      <ImageList>
        {/* {product.image.map((image, index) => (
          <img key={index} src={image} alt={`Product Image ${index + 1}`} />
        ))} */}
      </ImageList>
      <button className='btn bg-primary text-light my-2'>Add Image</button>
    </ImagesContainer>
  );
};

const ImagesContainer = styled.div`
  margin: 20px 0px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ImageList = styled.div`
  display: flex;
  gap: 10px;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

export default ProductImages;