import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TextEditor from './TextEditor';
import { SelectField } from '../../utils/Controls';
import ColorSelector from './ColorSelector';
import ProductImageGallery from './ProductImageGallery';
import { GetAllCategoriesService, AddProductService, UploadMultipleFileService, GetProductById, UpdateProductService } from '../../services/ProductService';
import { ColorDTO, ImageDTO, Product, SizeDTO } from './types';
import { toast } from 'react-toastify';
import { redirect, useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { log } from 'console';


const ProductFormEdit: React.FC = () => {
    const { productId } = useParams<{ productId: string }>(); // Retrieve productId from URL
    console.log(productId);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [inventory, setInventory] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [selectedColors, setSelectedColors] = useState<ColorDTO[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<SizeDTO[]>([]);
    const [selectedImages, setSelectedImages] = useState<{ file: File; altText: string }[]>([]);
    const [imagesData, setImagesData] = useState<ImageDTO[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('Active');
    const [rowVersion, setRowVersion] = useState('');

    // Fetch categories
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


    // Fetch product details
    const fetchProductDetails = async () => {
        try {
            const response = await GetProductById(productId!); // Fetch product by ID

            console.log("Response from Get Product By Id", response);

            if (response.success) {
                const product = response.data;

                console.log("Product", product);

                /**
                {
    "id": "daeb636c-599c-42dd-b2e7-0ff468e56ec1",
    "name": "Quần Jogger ECC Warp Knitting",
    "description": "<h1>Quần Jogger ECC Warp Knitting Mô tả</h1>",
    "price": 10,
    "stockQuantity": 13,
    "createdAt": "0001-01-01T00:00:00",
    "updatedAt": "0001-01-01T00:00:00",
    "categoryId": "661a73ee-b485-45e0-9898-0d83be47e58b",
    "status": "Inactive",
    "colors": [
        {
            "id": "8806944c-8fd2-42a3-b6d5-125a8196f131",
            "name": "Custom Color",
            "colorCode": "#000000"
        },
        {
            "id": "c4899342-6157-48c5-ab28-2af1e2cfdd67",
            "name": "Custom Color",
            "colorCode": "#e10e0e"
        },
        {
            "id": "c905ee08-0557-480c-a9ef-44e163c3f462",
            "name": "Custom Color",
            "colorCode": "#bf8282"
        }
    ],
    "sizes": [
        {
            "id": "7298d21e-4fd5-4ee9-9e47-10c2ba941ba1",
            "name": "S"
        },
        {
            "id": "564245c1-5dfd-4c40-9827-cc091dc28ff9",
            "name": "M"
        },
        {
            "id": "314e4dbb-29f7-4f09-8c45-f643d1405747",
            "name": "L"
        }
    ],
    "images": [
        {
            "id": "8721844b-6764-4101-bf76-44c87a32d261",
            "url": "https://res.cloudinary.com/dqp5kvzi1/image/upload/v1732370391/crdu1y03frpajssbjdb8.png",
            "altText": "Gui bao gia, Tu van thiet ke, Tiep nhan yeu cau, Coolxprint",
            "createdAt": "0001-01-01T00:00:00",
            "updatedAt": "0001-01-01T00:00:00",
            "productId": "00000000-0000-0000-0000-000000000000"
        },
        {
            "id": "2573b71f-9d08-4a32-b4a3-b3a47c8cd6f9",
            "url": "https://res.cloudinary.com/dqp5kvzi1/image/upload/v1732370392/b01idezfguefror6cugq.png",
            "altText": "Gui bao gia, Tu van thiet ke, Tiep nhan yeu cau, Coolxprint",
            "createdAt": "0001-01-01T00:00:00",
            "updatedAt": "0001-01-01T00:00:00",
            "productId": "00000000-0000-0000-0000-000000000000"
        },
        {
            "id": "4b645531-b675-45bc-8207-d63964459fe6",
            "url": "https://res.cloudinary.com/dqp5kvzi1/image/upload/v1732370396/wanbmwz1pscbwrxus5o7.png",
            "altText": "Gui bao gia, Tu van thiet ke, Tiep nhan yeu cau, Coolxprint",
            "createdAt": "0001-01-01T00:00:00",
            "updatedAt": "0001-01-01T00:00:00",
            "productId": "00000000-0000-0000-0000-000000000000"
        },
        {
            "id": "c220cae5-a612-495b-a65a-d7da3a7ba432",
            "url": "https://res.cloudinary.com/dqp5kvzi1/image/upload/v1732370390/qu7eg7est3qembguhcww.png",
            "altText": "Gui bao gia, Tu van thiet ke, Tiep nhan yeu cau, Coolxprint",
            "createdAt": "0001-01-01T00:00:00",
            "updatedAt": "0001-01-01T00:00:00",
            "productId": "00000000-0000-0000-0000-000000000000"
        }
    ],
    "discounts": [],
    "feedbacks": []
}
                 */

                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setInventory(product.stockQuantity);
                setDiscount(product.discount);
                setCategoryId(product.categoryId);
                setSelectedColors(product.colors || []);
                setSelectedSizes(product.sizes || []);
                setSelectedImages(product.images || []);
                setImagesData(product.images || []);
                setStatus(product.status);
                setRowVersion(product.rowVersion);
            } else {
                console.error('Error fetching product details:', response.message);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };


    useEffect(() => {
        fetchCategories();
        fetchProductDetails();
    }, [productId]);

    console.log("Selected Images", selectedImages);



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



    const handleSaveImages = async () => {
        try {
            const files = selectedImages.map((image) => image.file); // Extract files
            const altText = selectedImages.map((image) => image.altText).join(', '); // Combine alt texts
            // Call the upload service
            console.log("Product Id", productId);

            const response = await UploadMultipleFileService(files, productId!, altText);
            toast.success('Files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload files.');
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            id: productId,
            name,
            description,
            price,
            stockQuantity: inventory,
            discount,
            categoryId,
            rowVersion,
            colors: selectedColors,
            sizes: selectedSizes,
            images: [],
            discounts: [],
            feedbacks: [],
            status
        };

        console.log("Product Data", productData);

        /**
         {
    "id": "daeb636c-599c-42dd-b2e7-0ff468e56ec1",
    "name": "Quần Jogger ECC Warp Knitting Update",
    "description": "<h1>Quần Jogger ECC Warp Knitting Mô tả Update</h1>",
    "price": 10,
    "stockQuantity": 13,
    "categoryId": "dac47480-7c70-4964-91f4-6e181f6843ab",
    "colors": [
        {
            "id": "8806944c-8fd2-42a3-b6d5-125a8196f131",
            "name": "Custom Color",
            "colorCode": "#000000"
        },
        {
            "id": "c4899342-6157-48c5-ab28-2af1e2cfdd67",
            "name": "Custom Color",
            "colorCode": "#e10e0e"
        },
        {
            "name": "Custom Color",
            "colorCode": "#12f33f"
        }
    ],
    "sizes": [
        {
            "name": "XL"
        },
        {
            "name": "XXL"
        }
    ],
    "images": [],
    "discounts": [],
    "feedbacks": [],
    "status": "Inactive"
}
         */


        try {
            const response = await UpdateProductService(productId!, productData); // Update product
            console.log("Response from Update Product", response);

            if (response.success) {
                toast.success('Product updated successfully');
                handleSaveImages();
                // redirect to product details page
                redirect(`/products`);
            } else {
                toast.error('Error updating product');
                console.error('Error updating product:', response.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };


    return (
        <FormContainer onSubmit={handleSubmit}>
            <h2 className='text-center'>Edit Product</h2>
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
                    <ProductImageGallery selectedImages={selectedImages} imagesData={imagesData} setSelectedImages={setSelectedImages} />
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



export default ProductFormEdit;
