import React from "react";
import Footer from "../Footer/Footer";

const MainContent: React.FC = () => {
    return (
        <div className="content-wrapper">

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-xxl-8 mb-6 order-0">
                        <h1>Content Here</h1>
                    </div>
                </div>
            </div>
            <Footer />
            <div className="content-backdrop fade"></div>
        </div>
    );
};

export default MainContent;