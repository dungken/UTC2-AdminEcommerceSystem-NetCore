import React from "react";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear(); // Get the current year

    return (
        <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl">
                <div
                    className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                    <div className="text-body">
                        <span> © {currentYear}, made with ❤️ by </span>
                        <a href="" target="_blank" className="footer-link"> Coolmate - Dung Ken</a>
                    </div>
                    <div className="d-none d-lg-inline-block">
                        <a href="" className="footer-link me-4" target="_blank">License</a>
                        <a href="" target="_blank" className="footer-link me-4">More Themes</a>
                        <a href="" target="_blank" className="footer-link me-4">Documentation</a>
                        <a href="" target="_blank" className="footer-link">Support</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
