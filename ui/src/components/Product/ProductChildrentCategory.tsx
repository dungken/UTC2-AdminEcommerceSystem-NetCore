import React from "react"

const ProductChildrentCategory: React.FC = () => {
    return (
        <div className="container mt-4">
            <ul className="list-group">

                {/* <!-- Main Category 1 --> */}
                <li className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Main Category 1</span>
                        <button className="btn btn-sm btn-link text-decoration-none" data-bs-toggle="collapse" data-bs-target="#category1">
                            <i className="bi bi-chevron-down"></i>
                        </button>
                    </div>
                    <div id="category1" className=" ps-3 mt-2">
                        <ul className="list-group list-group-flush">

                            {/* <!-- Subcategory 1.1 --> */}
                            <li className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>|--|-- Subcategory 1.1</span>
                                    <button className="btn btn-sm btn-danger text-light">Inactive</button>
                                </div>
                                <div id="subcategory1-1" className=" ps-3 mt-2">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">|--|--|-- Subcategory 1.1.1</li>
                                        <li className="list-group-item">|--|--|-- Subcategory 1.1.2</li>
                                    </ul>
                                </div>
                            </li>

                            {/* <!-- Subcategory 1.2 --> */}
                            <li className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>|--|-- Subcategory 1.1</span>
                                    <button className="btn btn-sm btn-success text-light">Active</button>
                                </div>
                                <div id="subcategory1-1" className=" ps-3 mt-2">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">|--|--|-- Subcategory 1.1.1</li>
                                        <li className="list-group-item">|--|--|-- Subcategory 1.1.2</li>
                                    </ul>
                                </div>
                            </li>
                            {/* <!-- Subcategory 1.2 --> */}
                            <li className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>|--|-- Subcategory 1.1</span>
                                    <button className="btn btn-sm btn-warning text-light">Pending</button>
                                </div>
                                <div id="subcategory1-1" className=" ps-3 mt-2">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">|--|--|-- Subcategory 1.1.1</li>
                                        <li className="list-group-item">|--|--|-- Subcategory 1.1.2</li>
                                    </ul>
                                </div>
                            </li>

                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default ProductChildrentCategory;