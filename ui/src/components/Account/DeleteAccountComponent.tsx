import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DeleteAccountService } from '../../services/UserService';
import { useAuth } from '../../context/AuthContext';

const DeleteAccountComponent = () => {
    const { logout } = useAuth();
    const [isDeactivationConfirmed, setIsDeactivationConfirmed] = useState(false);

    const handleDeleteAccount = async () => {
        if (!isDeactivationConfirmed) {
            toast.error('You must confirm that you understand the deletion process.');
            return;
        }

        try {
            const response = await DeleteAccountService();
            if (response.success) {
                toast.success(response.message);
                logout();
            }
        } catch (error) {
            console.error('Delete account failed:', error);
            toast.error('Failed to delete account. Please try again later.');
        }
    };

    return (
        <div className="card-body p-4 m-2 rounded border-top">
            <h3 className="h4 mb-2">Delete Account</h3>
            <i className="mb-4 text-danger" >If you delete your account, all your data will be permanently removed from our servers. Please proceed with caution.</i>
            <div className="form-check my-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="confirmDeactivation"
                    checked={isDeactivationConfirmed}
                    onChange={(e) => setIsDeactivationConfirmed(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="confirmDeactivation">
                    I understand that deleting my account is permanent and irreversible.
                </label>
            </div>
            <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={!isDeactivationConfirmed}
            >
                Delete Account
            </button>
        </div>
    );
};

export default DeleteAccountComponent;
