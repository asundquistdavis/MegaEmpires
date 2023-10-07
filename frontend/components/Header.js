import React from "react";

const Header = (props) => {

    const {l, r, children, className} = props;

    return <>
        <div className={'flexRow ' + className}>
            <div>{l}</div>
            <div className="header">{children}</div>
            <div>{r}</div>
        </div>
    </>;
};

export default Header;
