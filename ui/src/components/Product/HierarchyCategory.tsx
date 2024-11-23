import React, { useEffect, useState } from 'react';
import './HierarchyCategory.css';
import { Link } from 'react-router-dom';
import { GetAllCategoriesService } from '../../services/ProductService';

interface Category {
    id: string;
    name: string;
    description: string;
    status: string;
    parentCategoryId: string | null;
    subCategories: Category[];
}

const HierarchyCategory: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);

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

    // Function to recursively render categories and avoid duplicates
    const renderCategories = (parentCategoryId: string | null, level: number = 0): JSX.Element[] => {
        // Filter categories that are direct children of the current parent category
        const filteredCategories = categories.filter(
            category => category.parentCategoryId === parentCategoryId
        );

        return filteredCategories.map(category => {
            // Render the parent category
            return (
                <li key={category.id} className="list-group-item category-item">
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to={`/product-list-by-category/${category.id}`}>
                            <span className="category-header text-decoration-underline">{category.name}</span>
                        </Link>
                        {category.subCategories.length > 0 && (
                            <span className="toggle-btn" data-bs-toggle="collapse" data-bs-target={`#subCategory-${category.id}`}>
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        )}
                    </div>
                    {category.subCategories.length > 0 && (
                        <div id={`subCategory-${category.id}`} className="mt-2">
                            <ul className="list-group">
                                {/* Recursive call to render subcategories */}
                                {renderCategories(category.id, level + 1)}
                            </ul>
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Product Category Hierarchy</h3>

            <div className="category-tree">
                <ul className="list-group">
                    {/* Render the top-level categories */}
                    {renderCategories(null)}
                </ul>
            </div>
        </div>
    );
};

export default HierarchyCategory;
