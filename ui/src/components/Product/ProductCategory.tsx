import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCategoryTable from './ProductCategoryTable';
import { DeleteCategoryService, GetAllCategoriesService, UpdateCategoryService, CreateCategoryService } from '../../services/ProductService';
import ProductCategoryModal from './ProductCategoryModal';

const ProductCategory: React.FC = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchCategories = async () => {
        const response = await GetAllCategoriesService();
        if (response.success) {
            setCategories(response.data);
        } else {
            console.error('Error fetching categories:', response.message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEditCategory = (category: any) => {
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    const handleDeleteCategory = async (id: string) => {
        await DeleteCategoryService(id);
        fetchCategories();
    };

    const handleSubmitCategory = async (category: any) => {
        if (category.id) {
            await UpdateCategoryService(category);
        } else {
            await CreateCategoryService(category);
        }
        fetchCategories();
        setSelectedCategory(null);
        setIsModalVisible(false);
    };

    return (
        <div className="container-xxl flex-grow-1 py-2">
            <div className="row">
                <div className="mb-6 order-0">
                    <div className="card">
                        <h3 className="card-title mb-0 mt-4 text-center"> Product Category Management</h3>
                        <div className="card-header d-flex justify-content-around p-3">
                            <div className="d-flex justify-content-center align-items-center gap-5">
                                <button className="btn btn-primary rounded" onClick={() => handleEditCategory({})}>
                                    <i className="bx bx-plus"></i> Create
                                </button>

                                <div className="form-outline" data-mdb-input-init>
                                    <input
                                        type="search"
                                        id="form1"
                                        className="form-control"
                                        placeholder="Search..."
                                    />
                                </div>

                                <span className="text-muted ">Filter: </span>
                                <select
                                    // value={pageSize}
                                    // onChange={handlePageSizeChange}
                                    className="form-select form-select-sm"
                                    style={{ width: '150px', borderColor: '#ced4da', borderRadius: '4px', boxShadow: 'none' }}
                                >
                                    {['Select Status', 'Active', 'Inactive', 'Pending'].map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        <ProductCategoryTable categories={categories} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory} />
                    </div>
                </div>
            </div>

            <ProductCategoryModal
                category={selectedCategory}
                onSubmit={handleSubmitCategory}
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default ProductCategory;
