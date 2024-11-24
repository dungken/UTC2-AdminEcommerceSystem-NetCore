import React, { useState } from "react";
import { Product } from "./types";
import { Link } from "react-router-dom";
import { DeleteProductService } from "../../services/ProductService";
import { toast } from "react-toastify";

const ProductCard: React.FC<{ product: Product; onDelete: (id: string) => void }> = ({
    product,
    onDelete,
}) => {

    // console.log(product.id);

    const [isExpanded, setIsExpanded] = useState(false);

    const handleWatchMoreProductClick = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleDeleteProductClick = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the product: ${product.name}?`
        );

        if (confirmDelete) {
            // console.log("Deleting product:", product.id);

            try {
                const response = await DeleteProductService(product.id);
                console.log(response);

                if (response.success) {
                    toast.success("Product deleted successfully");
                    if (product.id) {
                        onDelete(product.id);
                    } else {
                        toast.error("Product ID is undefined");
                    }
                } else {
                    toast.error("Failed to delete product");
                }

            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product");
            }
        }
    };

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                width: "350px",
                background: "#ffffff",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                overflow: "hidden",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 6px 12px rgba(0, 0, 0, 0.1)";
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    marginBottom: "16px",
                    background: "#f7f7f7",
                    borderRadius: "8px",
                }}
            >
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url}
                        alt={product.images[0].altText}
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    <p
                        style={{
                            fontSize: "14px",
                            color: "#888",
                        }}
                    >
                        No image available
                    </p>
                )}
            </div>
            <Link to={`edit/${product.id}`}>{product.name}</Link>
            <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "12px",
                    maxHeight: "50px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            />
            <p
                style={{
                    fontSize: "16px",
                    color: "#2a9d8f",
                    fontWeight: "bold",
                    marginBottom: "12px",
                }}
            >
                ${product.price.toFixed(2)}
            </p>

            {/* Watch More Section */}
            {isExpanded && (
                <div
                    style={{
                        marginBottom: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                    }}
                >
                    <strong>Colors:</strong>
                    <div
                        style={{
                            display: "flex",
                            gap: "6px",
                        }}
                    >
                        {product.colors.map((color, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    backgroundColor: color.colorCode,
                                    border: "1px solid #ccc",
                                }}
                                title={color.name}
                            ></div>
                        ))}
                    </div>
                    <strong>Sizes:</strong>
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "5px",
                            flexWrap: "wrap",
                        }}
                    >
                        {product.sizes.map((size, index) => (
                            <span
                                key={index}
                                style={{
                                    padding: "4px 10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    color: "#333",
                                }}
                            >
                                {size.name}
                            </span>
                        ))}
                    </div>
                    <div>
                        <strong>Images:</strong>
                        <div
                            style={{
                                display: "flex",
                                gap: "5px",
                                overflowX: "scroll",
                                marginTop: "10px",
                                paddingBottom: "5px",
                            }}
                        >
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.altText}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: "1px solid rgb(149 142 142)",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={handleWatchMoreProductClick}
                style={{
                    padding: "8px 16px",
                    background: "rgb(65 106 228)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "12px",
                    width: "100%",
                }}
            >
                {isExpanded ? "Show Less" : "Watch More"}
            </button>

            {/* Delete Button */}
            <button
                onClick={handleDeleteProductClick}
                style={{
                    padding: "8px 16px",
                    background: "#e63946",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "12px",
                    width: "100%",
                }}
            >
                Delete Product
            </button>
        </div>
    );
};

export default ProductCard;
