import React from "react";

const Base = (props) => {

    const { children } = props;

    return <>
        <div className="w-hor-auto">
            <div>
                {children}
            </div>
        </div>
    
    </>;
};

export default Base;
