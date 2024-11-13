import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';

const SocialLogin: React.FC = () => {
    return (
        <div className='row justify-content-between align-items-center'>
            <div className="col-md-6">
                <GoogleLoginButton />
            </div>
            <div className="col-md-6">
                <FacebookLoginButton />
            </div>
        </div>
    );
};

export default SocialLogin;