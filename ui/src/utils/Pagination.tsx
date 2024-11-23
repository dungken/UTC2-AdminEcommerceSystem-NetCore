import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    console.log("Pagination.....");
    console.log("Current Page:", currentPage);
    console.log("Total Pages:", totalPages);

    const handlePrevious = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className='d-flex align-items-center justify-content-between'>
            <div>

            </div>
            <div className="d-flex justify-content-center m-3">
                <button className="btn btn-outline-primary me-2" disabled={currentPage === 1} onClick={handlePrevious}>
                    Previous
                </button>
                <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                <button className="btn btn-outline-primary ms-2" disabled={currentPage === totalPages} onClick={handleNext}>
                    Next
                </button>
            </div>

        </div>
    );
};

export default Pagination;
