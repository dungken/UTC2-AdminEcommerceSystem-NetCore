import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InputField, SelectField } from '../../utils/Controls';
import { CreateCategoryService, GetAllCategoriesService } from '../../services/ProductService';
import { Modal } from 'react-bootstrap';

const ProductCategoryModal: React.FC<{ category: any, onSubmit: (category: any) => void, isVisible: boolean, onClose: () => void }> = ({ category, onSubmit, isVisible, onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState<string | null>(null);
    const [status, setStatus] = useState('Active');
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (category) {
            setCategoryName(category.name || '');
            setCategoryDescription(category.description || '');
            setParentCategoryId(category.parentCategoryId || null);
            setStatus(category.status || 'Active');
        } else {
            setCategoryName('');
            setCategoryDescription('');
            setParentCategoryId(null);
            setStatus('Active');
        }
    }, [category]);

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

    const validateForm = () => {
        if (!categoryName) {
            toast.error('Category name is required');
            return false;
        }

        if (!categoryDescription) {
            toast.error('Category description is required');
            return false;
        }

        if (!status) {
            toast.error('Status is required');
            return false;
        }

        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const newCategory = {
            ...category,
            name: categoryName,
            description: categoryDescription,
            parentCategoryId,
            status
        };
        onSubmit(newCategory);
        onClose(); // Close the modal using the onClose prop
        // Reload page
        window.location.reload();
    };

    return (
        <Modal show={isVisible} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{category && category.id ? 'Edit Product Category' : 'Create Product Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="row g-4" onSubmit={handleSubmit}>
                    <InputField
                        label="Name"
                        id="modalCreateName"
                        name="name"
                        placeholder="Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <InputField
                        label="Description"
                        id="modalCreateDescription"
                        name="description"
                        placeholder="Category Description"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                    <SelectField
                        label="Belong To Category"
                        id="modalCreateParentCategory"
                        name="parentCategoryId"
                        options={[
                            ...categories.map(category => ({ value: category.id, label: category.name }))
                        ]}
                        value={parentCategoryId || ''}
                        onChange={(e) => setParentCategoryId(e.target.value || null)}
                    />
                    <SelectField
                        label="Status"
                        id="modalCreateStatus"
                        name="status"
                        options={[
                            { value: 'Active', label: 'Active' },
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Inactive', label: 'Inactive' }
                        ]}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </Modal.Body>
            {/* <Modal.Footer>
                <button className="btn btn-secondary" onClick={onClose}>Close</button>
                <button className="btn btn-primary" onClick={() => onSubmit(category)}>Save changes</button>
            </Modal.Footer> */}
            <ToastContainer />
        </Modal>
    );
};

export default ProductCategoryModal;