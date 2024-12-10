import React, { useEffect, useState } from "react";
import { GetAllProductsService } from "../../services/ProductService";
import ProductCard from "./ProductCard";
import { Product } from "./types";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6); // Initially show 6 products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await GetAllProductsService();

        setProducts(response.data);
        setLoading(false); // Set loading to false once products are fetched
      } catch (error) {
        setError("Failed to load products");
        setLoading(false); // Set loading to false even in case of error
      }
    };

    fetchProducts();
  }, []);

  console.log(products);


  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Show 6 more products on click
  };

  const handleShowLess = () => {
    setVisibleCount((prevCount) => (prevCount > 6 ? prevCount - 6 : 6)); // Show 6 fewer products
  };

  if (loading) {
    return <div>Loading products...</div>; // You can replace this with a spinner
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an error
  }

  const handleDeleteProduct = (id: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-around",
        }}
      >
        {products.slice(0, visibleCount).map((product) => (
          <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
        ))}
      </div>



      <div className="text-center row d-flex justify-content-around align-items-center mt-3">
        <div className="col-md-6">
          <div style={{ marginTop: "16px" }}>
            {visibleCount > 6 && (
              <button
                onClick={handleShowLess}
                style={{
                  padding: "10px 20px",
                  background: "rgb(29 99 91)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  marginRight: "10px",
                  display: "inline-block",
                }}
              >
                Show Less
              </button>
            )}
          </div>
        </div>
        <div className="col-md-6">
          {visibleCount < products.length && (
            <button
              onClick={handleShowMore}
              style={{
                padding: "10px 20px",
                background: "#2a9d8f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                display: "inline-block",
              }}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
