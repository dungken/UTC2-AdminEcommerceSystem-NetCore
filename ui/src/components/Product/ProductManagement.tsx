import React, { useState } from 'react';
import styled from 'styled-components';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import ProductImages from './ProductImages';
import ProductReviews from './ProductReviews';
import { Product } from './types';
import ProductImageGallery from './ProductImageGallery';

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    // const totalProducts = products.length;
    // const activeProducts = products.filter(product => product.active).length;

    // const handleAddProduct = (product: Product) => {
    //     setProducts([...products, product]);
    // };

    // const handleEditProduct = (updatedProduct: Product) => {
    //     setProducts(
    //         products.map((product) =>
    //             product.id === updatedProduct.id ? updatedProduct : product
    //         )
    //     );
    // };

    // const handleDeleteProduct = (id: string) => {
    //     setProducts(products.filter((product) => product.id !== id));
    // };

    // const handleToggleActive = (id: string) => {
    //     setProducts(
    //         products.map((product) =>
    //             product.id === id ? { ...product, active: !product.active } : product
    //         )
    //     );
    // };

    // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchTerm(e.target.value);
    // };

    // const handleExport = () => {
    //     // Implement export functionality here
    //     console.log('Exporting products...');
    // };

    // const handleUpdateInventoryAndPrice = (id: string, price: number, inventory: number) => {
    //     setProducts(
    //         products.map((product) =>
    //             product.id === id ? { ...product, price, inventory } : product
    //         )
    //     );
    // };

    // const handleApplyDiscount = (id: string, discount: number) => {
    //     setProducts(
    //         products.map((product) =>
    //             product.id === id ? { ...product, discount } : product
    //         )
    //     );
    // };

    // const handleLinkCategory = (id: string, category: string) => {
    //     setProducts(
    //         products.map((product) =>
    //             product.id === id ? { ...product, category } : product
    //         )
    //     );
    // };

    // const handleAddTags = (id: string, tags: string[]) => {
    //     setProducts(
    //         products.map((product) =>
    //             product.id === id ? { ...product, tags: [...product.tags, ...tags] } : product
    //         )
    //     );
    // };

    // const filteredProducts = products.filter((product) =>
    //     product.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // // Pagination logic
    // const indexOfLastProduct = currentPage * productsPerPage;
    // const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    // const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <Container>
            <Header>
                <h1> Product Management</h1>
                <div className="form-outline" data-mdb-input-init>
                    <input
                        type="search"
                        id="form1"
                        className="form-control"
                        placeholder="Search products..."
                    />
                </div>
            </Header>

            <Stats>
                {/* <p>Total Products: {totalProducts}</p>
                <p>Active Products: {activeProducts}</p> */}
            </Stats>

            <div className="row">
                <ProductForm
                // onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
                // selectedProduct={selectedProduct}
                // onClearSelection={() => setSelectedProduct(null)}
                // onUpdateInventoryAndPrice={handleUpdateInventoryAndPrice}
                // onApplyDiscount={handleApplyDiscount}
                // onLinkCategory={handleLinkCategory}
                // onAddTags={handleAddTags}
                // selectedImages={selectedImages}
                // setSelectedImages={setSelectedImages}
                />

            </div>

            <div className="row my-3">
                {/* <ProductList
                    products={currentProducts}
                    onEdit={setSelectedProduct}
                    onDelete={handleDeleteProduct}
                    onToggleActive={handleToggleActive}
                    onUpdateInventoryAndPrice={handleUpdateInventoryAndPrice}
                    onApplyDiscount={handleApplyDiscount}
                    onLinkCategory={handleLinkCategory}
                    onAddTags={handleAddTags}
                /> */}

                {/* <Pagination>
                    {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                        <PageNumber key={i + 1} onClick={() => paginate(i + 1)}>
                            {i + 1}
                        </PageNumber>
                    ))}
                </Pagination> */}

            </div>



            <div className="row mx-1 my-3">    {
                selectedProduct && (
                    <>
                        {/* <ProductImageGallery setSelectedImages={selectedImages} selectedImages={setSelectedImages} /> */}
                        {/* <ProductReviews productId={selectedProduct.id} /> */}
                    </>
                )
            }</div>

        </Container >
    );
};

export default ProductManagement;

const Container = styled.div`
    padding: 10px 20px;
    margin: 0 auto;
    background: #f4f4f4;
    border-radius: 8px;
    margin: 13px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 2rem;
    color: #333;
  }
`;


const Stats = styled.div`
     display: flex;
    justify-content: space-between;

  p {
    font-size: 1rem;
    color: #333;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const PageNumber = styled.button`
  padding: 10px;
  margin: 0 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;