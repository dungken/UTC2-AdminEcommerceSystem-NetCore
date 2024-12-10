import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextEditor from './TextEditor';
import { SelectField } from '../../utils/Controls';
import ColorSelector from './ColorSelector';
import ProductImageGallery from './ProductImageGallery';
import { GetAllCategoriesService, AddProductService, UploadMultipleFileService } from '../../services/ProductService';
import { ColorDTO, ImageDTO, Product, SizeDTO } from './types';
import { toast } from 'react-toastify';


const ProductForm: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [selectedColors, setSelectedColors] = useState<ColorDTO[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<SizeDTO[]>([]);
    const [selectedImages, setSelectedImages] = useState<{ file: File; altText: string }[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('Active');

    const [categories, setCategories] = useState<any[]>([]);
    const fetchCategories = async () => {
        try {
            const response = await GetAllCategoriesService();
            if (response.success) {
                setCategories(response.data);
            } else {
                console.error('Error fetching categories:', response.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const sizeOptions: SizeDTO[] = [
        { name: 'S' },
        { name: 'M' },
        { name: 'L' },
        { name: 'XL' },
        { name: 'XXL' },
    ];

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, (option) => {
            return sizeOptions.find((size) => size.name === option.value) as { name: string };
        });
        setSelectedSizes(selectedOptions);
    };



    const handleSaveImages = async (productIdParam: string) => {
        try {
            // Prepare data for the API call
            const files = selectedImages.map((image) => image.file); // Extract files
            const altText = selectedImages.map((image) => image.altText).join(', '); // Combine alt texts
            const productId = productIdParam;
            // Call the upload service
            const response = await UploadMultipleFileService(files, productId, altText);
            console.log('Upload response:', response);

            // Handle the response
            toast.success('Files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload files.');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name,
            description,
            price,
            stockQuantity: inventory,
            discount,
            categoryId,
            colors: selectedColors,
            sizes: selectedSizes,
            images: [],
            discounts: [],
            feedbacks: [],
            status
        };

        try {
            const response = await AddProductService(productData);
            if (response.success) {
                toast.success('Product added successfully');
                // Handle upload images to cloudinary
                handleSaveImages(response.data.product.id);
                // Reset the form
                setName('');
                setDescription('');
                setPrice(0);
                setInventory(0);
                setDiscount(0);
                setCategoryId('');
                setSelectedColors([]);
                setSelectedSizes([]);
                setSelectedImages([]);
                setStatus('Active');

            } else {
                toast.error('Error adding product');
                console.error('Error adding product:', response.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };


    return (
        <FormContainer onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Product Name"
                value={name}
                name='name'
                onChange={(e) => setName(e.target.value)}
                required
            />

            <TextEditor content={description} setContent={setDescription} />

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
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    options={[
                        ...categories.map(category => ({ value: category.id, label: category.name }))
                    ]}
                />
                <div className="col-md-4">
                    <select
                        className="form-select"
                        multiple
                        aria-label="multiple select example"
                        onChange={handleSizeChange}
                    >
                        <option>Select Size</option>
                        {sizeOptions.map((size) => (
                            <option key={size.id} value={size.name}>
                                {size.name}
                            </option>
                        ))}
                    </select>
                </div>


                <ColorSelector selectedColors={selectedColors} setSelectedColors={setSelectedColors} />
            </div>
            <div className="row my-3">
                <div className="col-md-8">
                    <h6>Product Images</h6>
                    <ProductImageGallery selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                </div>
                <SelectField
                    label="Status"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Inactive', label: 'Inactive' }
                    ]}
                />
            </div>

            <button type="submit" className='btn btn-primary'>
                Submit
            </button>

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
                background - color: #007bff;
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
