import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetSubCategoriesService } from "../../services/ProductService";

const ProductChildrentCategory: React.FC = () => {
    const { parentCategoryId } = useParams<{ parentCategoryId: string }>();
    const [subCategories, setSubCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                if (parentCategoryId) {
                    const response = await GetSubCategoriesService(parentCategoryId);
                    // console.log(response);

                    setSubCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching subcategories", error);
            }
        };

        fetchSubCategories();
    }, [parentCategoryId]);

    const renderSubCategories = (categories: any[], level: number = 0) => {
        return categories.map((category) => (
            <li key={category.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                    <span>{'|--'.repeat(level)} {category.name}</span>
                    <button className={`btn btn-sm ${category.status === 'Active' ? 'btn-success' : category.status === 'Inactive' ? 'btn-danger' : 'btn-warning'} text-light`}>
                        {category.status}
                    </button>
                </div>
                {category.subCategories && category.subCategories.length > 0 && (
                    <ul className="list-group list-group-flush ps-3 mt-2">
                        {renderSubCategories(category.subCategories, level + 1)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <div className="container mt-4">
            <ul className="list-group">
                {renderSubCategories(subCategories)}
            </ul>
        </div>
    );
}

export default ProductChildrentCategory;