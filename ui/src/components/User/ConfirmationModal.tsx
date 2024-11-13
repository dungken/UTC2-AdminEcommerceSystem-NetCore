import React from 'react';

// Declare bootstrap property on window object
declare global {
    interface Window {
        bootstrap: any;
    }
}

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {

    // Function to close the modal programmatically
    const closeModal = () => {
        const modalElement = document.getElementById('confirmationModal');
        if (modalElement) {
            const modal = new window.bootstrap.Modal(modalElement); // Initialize modal from Bootstrap
            modal.hide(); // Hide the modal after confirming
        }
    };

    const handleConfirm = () => {
        onConfirm(); // Perform the confirm action
        closeModal(); // Close the modal after the action is performed
    };

    const handleCancel = () => {
        onCancel(); // Perform the cancel action
        closeModal(); // Close the modal when canceled
    };

    return (
        <div className="modal fade" id="confirmationModal" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="confirmationModalLabel">Confirm Deletion</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        {message}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancel}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleConfirm}>Yes, Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
