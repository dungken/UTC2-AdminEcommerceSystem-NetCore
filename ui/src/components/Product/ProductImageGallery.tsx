import React, { useState } from 'react';
import './ProductImageGallery.css';
import { ImageDTO } from './types';

interface ProductImageGalleryProps {
    selectedImages: { file: File; altText: string }[]; // Updated type
    imagesData?: ImageDTO[];
    setSelectedImages: React.Dispatch<React.SetStateAction<{ file: File; altText: string }[]>>;
}


const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ selectedImages, imagesData, setSelectedImages }) => {
    const initialImages: ImageDTO[] = [
        { url: 'https://via.placeholder.com/300', altText: 'Image 1' },
        { url: 'https://via.placeholder.com/300', altText: 'Image 2' },
        { url: 'https://via.placeholder.com/300', altText: 'Image 3' },
        { url: 'https://via.placeholder.com/300', altText: 'Image 4' },
    ];

    const [images, setImages] = useState<ImageDTO[]>(initialImages);
    const [mainImage, setMainImage] = useState<ImageDTO>(initialImages[0]); // Initialize with the first image from initialImages

    const handleThumbnailClick = (image: ImageDTO) => {
        setMainImage(image);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const uploadedFiles = Array.from(event.target.files);

            // Prompt for altText for each file
            const newImages = uploadedFiles.map((file) => {
                const altText = prompt(`Enter alt text for ${file.name}:`) || file.name; // Use the file name if no altText is provided
                const url = URL.createObjectURL(file);

                return {
                    file, // Keep the original File object
                    altText,
                    url,
                };
            });

            setMainImage({ url: newImages[0].url, altText: newImages[0].altText }); // Set the first uploaded image as the main image
            setSelectedImages((prevSelected) => [...prevSelected, ...newImages]); // Update selected images with files and altText
        }
    };

    // Display thumbnails based on selectedImages or fallback to initial images
    const displayImages = selectedImages.length > 0
        ? selectedImages.map((img) => ({
            url: img.file instanceof File ? URL.createObjectURL(img.file) : '',
            altText: img.altText,
        }))
        : images;


    return (
        <div className="product-gallery">
            {/* Main image */}
            <div className="main-image-frame">
                <img src={mainImage.url} alt={mainImage.altText} className="main-image" />
            </div>

            {/* Thumbnails */}
            <div className="thumbnail-row">
                {
                    imagesData && imagesData.length > 0 && imagesData.map((image, index) => (
                        <div key={index} className="thumbnail-frame">
                            <img
                                src={image.url}
                                alt={image.altText}
                                onClick={() => setMainImage(image)}
                                className="thumbnail active-thumbnail"
                            />
                        </div>
                    ))
                }
                {displayImages.map((image, index) => (
                    <div key={index} className="thumbnail-frame">
                        <img
                            src={image.url}
                            alt={image.altText}
                            onClick={() => setMainImage(image)}
                            className={`thumbnail ${mainImage.url === image.url ? 'active-thumbnail' : ''}`}
                        />
                    </div>
                ))}
            </div>

            {/* Upload Button */}
            <div className="upload-button">
                <label className="btn btn-sm btn-primary">
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>
        </div>
    );
};

export default ProductImageGallery;