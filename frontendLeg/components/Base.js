import React from "react";
import '/frontend/styles/base.scss'

const Base = (props) => {

    const { children } = props;

    return <>
        <div className="basePage">
            <div className="baseBody">
                {children}
            </div>
        </div>
    
    </>;
};

export default Base;
