import React, { useEffect, useState } from 'react';
import './HierarchyCategory.css';
import { Link } from 'react-router-dom';


const HierarchyCategory: React.FC = () => {
    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Product Category Hierarchy</h3>

            <div className="category-tree">
                <ul className="list-group">
                    {/* <!-- Main Category 1 --> */}
                    <li className="list-group-item category-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to={'/product-list-by-category'}><span className="category-header text-decoration-underline">Electronics</span></Link>
                            <span className="toggle-btn" data-bs-toggle="" data-bs-target="#electronicsSubCategories">
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        </div>
                        <div id="electronicsSubCategories" className=" mt-2">
                            <ul className="list-group">
                                {/* <!-- Subcategory --> */}
                                <li className="list-group-item category-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link to={'/product-list-by-category'}><span className="category-header text-decoration-underline">Mobiles</span></Link>
                                        <span className="toggle-btn" data-bs-toggle="collapse" data-bs-target="#mobilesSubCategories">
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                    <div id="mobilesSubCategories" className=" mt-2">
                                        <ul className="list-group">
                                            <li className="list-group-item category-item">Smartphones</li>
                                            <li className="list-group-item category-item">Feature Phones</li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="list-group-item category-item">Laptops</li>
                                <li className="list-group-item category-item">Cameras</li>
                            </ul>
                        </div>
                    </li>

                    {/* <!-- Main Category 2 --> */}
                    <li className="list-group-item category-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="category-header">Home Appliances</span>
                            <span className="toggle-btn" data-bs-toggle="" data-bs-target="#homeAppliancesSubCategories">
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        </div>
                        <div id="homeAppliancesSubCategories" className=" mt-2">
                            <ul className="list-group">
                                <li className="list-group-item category-item">Refrigerators</li>
                                <li className="list-group-item category-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Washing Machines</span>
                                        <span className="toggle-btn" data-bs-toggle="" data-bs-target="#washingMachinesSubCategories">
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                    <div id="washingMachinesSubCategories" className=" mt-2">
                                        <ul className="list-group">
                                            <li className="list-group-item category-item">Front Load</li>
                                            <li className="list-group-item category-item">Top Load</li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="list-group-item category-item">Air Conditioners</li>
                            </ul>
                        </div>
                    </li>

                    {/* <!-- Main Category 3 --> */}
                    <li className="list-group-item category-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="category-header">Fashion</span>
                            <span className="toggle-btn" data-bs-toggle="" data-bs-target="#fashionSubCategories">
                                <i className="bi bi-chevron-down"></i>
                            </span>
                        </div>
                        <div id="fashionSubCategories" className=" mt-2">
                            <ul className="list-group">
                                <li className="list-group-item category-item">Men's Clothing</li>
                                <li className="list-group-item category-item">Women's Clothing</li>
                                <li className="list-group-item category-item">Accessories</li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HierarchyCategory;
