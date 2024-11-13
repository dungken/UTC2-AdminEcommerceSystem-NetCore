import React, { useState } from 'react';
import './ProductImageGallery.css';

const ProductImageGallery = () => {
    // Sample images array (in a real app, these might come from props or an API)
    const images = [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
    ];

    // State for the selected main image
    const [mainImage, setMainImage] = useState(images[0]);

    // Handle thumbnail click
    const handleThumbnailClick = (image: string) => {
        setMainImage(image);
    };

    return (
        <div className="product-gallery">
            {/* Main image display */}
            <div className="main-image">
                <img src={mainImage} alt="Product" />
            </div>

            {/* Thumbnails */}
            <div className="row thumbnail-row">
                {images.map((image, index) => (
                    <div key={index} className="col-md-3 thumbnail">
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => handleThumbnailClick(image)}
                            className={mainImage === image ? 'active-thumbnail' : ''}
                        />
                    </div>
                ))}
            </div>

            {/* Button Upload */}
            <div className="upload-button mt-2">
                <button className="btn btn-sm btn-primary">Upload Image</button>
            </div>
        </div>
    );
};

export default ProductImageGallery;
