import React from 'react';
import styled from 'styled-components';
import { Product } from './ProductManagement';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onUpdateInventoryAndPrice: (id: number, price: number, inventory: number) => void;
  onApplyDiscount: (id: number, discount: number) => void;
  onLinkCategory: (id: number, category: string) => void;
  onAddTags: (id: number, tags: string[]) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onToggleActive, onUpdateInventoryAndPrice, onApplyDiscount, onLinkCategory, onAddTags }) => (
  <ListContainer>
    {products.map((product) => (
      <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} onToggleActive={onToggleActive} />
    ))}
  </ListContainer>
);

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onToggleActive }) => (
  <Card>
    <h4>{product.name}</h4>
    <img src={product.images[0]} alt={product.name} />
    <p className='my-2'> {product.description}</p>
    <p>Price: ${product.price}</p>
    <p>Inventory: {product.inventory}</p>
    <ButtonGroup>
      <button className="btn btn-sm btn-warning">
        <i className="bi bi-pencil"></i>
      </button>
      <button className="btn btn-sm btn-danger">
        <i className="bi bi-trash"></i>
      </button>
      <button className="btn btn-sm btn-primary">
        {product.active ? <i className="bi bi-toggle-off"></i> : <i className="bi bi-toggle-on"></i>}
      </button>

    </ButtonGroup>
  </Card>
);

const ListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: #333;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 4px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 20px;

  // button {
  //    padding: 3px 13px;
  //   color: #fff;
  //   border: none;
  //   border-radius: 9px;
  //   cursor: pointer;
  // }
`;

export default ProductList;