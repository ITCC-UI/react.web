import React, { useState } from 'react';
import Eye from "/images/eye.svg";
import Download from "/images/Download-white.png";
import { PulseLoader } from 'react-spinners';

const ManForms = ({ title, contents, reveal, download }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        await download();
        setIsLoading(false);
    };

    return (
        <div className="forms">
            <div className="div-holder">
                <div className="form-title">
                    <div className="header-title">
                        {title}
                    </div>
                    <img src={Eye} alt="Eye-Icon" onClick={reveal} />
                </div>
                <div className="contents">
                    {contents}
                </div>
                <button onClick={handleDownload} className="form-buttons">
                    {isLoading ? (
                       <PulseLoader size={10} color="#fff" />
                    ) : (
                        <>
                            <img src={Download} alt="download" /> Download
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ManForms;