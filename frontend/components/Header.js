import React from "react";
import '/frontend/styles/header.scss'

const Header = (props) => {

    const {left, right, children, className} = props;

    return <>
        <div className={'flexRow ' + className}>
            <div className="headerSide">{left}</div>
            <div className="headerTitle">{children}</div>
            <div className="headerSide">{right}</div>
        </div>
    </>;
};

export default Header;
