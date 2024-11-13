import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Product } from './ProductManagement';
import TextEditor from './TextEditor';
import { SelectField } from '../../utils/Controls';
import ColorSelector from './ColorSelector';
import ProductImageGallery from './ProductImageGallery';

interface ProductFormProps {
    onSubmit: (product: Product) => void;
    selectedProduct: Product | null;
    onClearSelection: () => void;
    onUpdateInventoryAndPrice: (id: number, price: number, inventory: number) => void;
    onApplyDiscount: (id: number, discount: number) => void;
    onLinkCategory: (id: number, category: string) => void;
    onAddTags: (id: number, tags: string[]) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    onSubmit,
    selectedProduct,
    onClearSelection,
    onUpdateInventoryAndPrice,
    onApplyDiscount,
    onLinkCategory,
    onAddTags
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        if (selectedProduct) {
            setName(selectedProduct.name);
            setDescription(selectedProduct.description);
            setPrice(selectedProduct.price);
            setInventory(selectedProduct.inventory);
            setDiscount(selectedProduct.discount || 0);
            setImages(selectedProduct.images);
            setCategory(selectedProduct.category);
            setTags(selectedProduct.tags);
        }
    }, [selectedProduct]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: selectedProduct ? selectedProduct.id : Date.now(),
            name,
            description,
            price,
            inventory,
            discount,
            images,
            category,
            tags,
            active: true,
        });
        onClearSelection();
    };

    return (
        <FormContainer onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Short Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <TextEditor />

            <div className="row">
                <div className="col-md-4">
                    <label htmlFor="price" className='my-0'>Price</label>
                    <input
                        type="number"
                        placeholder="Price"
                        className='form-control'
                        value={price}
                        min={0}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="Discount" className='my-0'>Discount (%)</label>
                    <input
                        type="number"
                        placeholder="Discount"
                        className='form-control'
                        value={discount}
                        min={0}
                        step="0.01"
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="Inventory" className='my-0'>Inventory</label>
                    <input
                        type="number"
                        placeholder="Inventory"
                        className='form-control'
                        value={inventory}
                        min={0}
                        onChange={(e) => setInventory(Number(e.target.value))}
                    />
                </div>

            </div>

            <div className="row my-3">
                <SelectField
                    label="Category"
                    id="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                        { value: 'Áo', label: 'Áo' },
                        { value: 'Quần', label: 'Quần' },
                        { value: 'Giày', label: 'Giày' }
                    ]}
                />
                <div className="col-md-4">
                    <select className="form-select" multiple aria-label="multiple select example">
                        <option selected>Select Size</option>
                        <option value="1">S</option>
                        <option value="2">M</option>
                        <option value="3">L</option>
                    </select>
                </div>

                <ColorSelector />

            </div>
            <div className="row my-3">
                <div className="col-md-8">
                    <h6>Product Images</h6>
                    <ProductImageGallery />
                </div>
                <SelectField
                    label="Status"
                    id="status"
                    options={[
                        { value: 'active', label: 'Active' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'inactive', label: 'Inactive' }
                    ]}
                />

            </div>

            <div className="row my-3">

            </div>

            <ButtonGroup>
                <button type="submit">
                    {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
                {selectedProduct && (
                    <button type="button" onClick={onClearSelection}>
                        Clear
                    </button>
                )}
            </ButtonGroup>
        </FormContainer>
    );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  input, textarea, button {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    background-color: #007bff;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  button {
    padding: 8px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

export default ProductForm;
