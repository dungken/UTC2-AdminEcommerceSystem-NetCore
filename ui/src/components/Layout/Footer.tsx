import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl">
                <div
                    className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                    <div className="text-body">
                        <span>  © {new Date().getFullYear()}, made with ❤️ by </span>
                        <Link to="https://example.com" target="_blank" className="footer-link"> Coolmate - Dung Ken</Link>
                    </div>
                    <div className="d-none d-lg-inline-block">
                        <Link to="https://example.com/license" className="footer-link me-4" target="_blank">License</Link>
                        <Link to="https://example.com/themes" target="_blank" className="footer-link me-4">More
                            Themes</Link>

                        <Link to="https://example.com/documentation" target="_blank" className="footer-link me-4">Documentation</Link>

                        <Link to="https://example.com/support" target="_blank" className="footer-link">Support</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
