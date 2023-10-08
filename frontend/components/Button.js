import React from "react";
import '/frontend/styles/button.scss'

const Button = (props) => {
    const {Icon, children, onClick, className, width, height} = props;

    const btnType = Icon? 'btnI ': 'btnT '
    
    const _width = width||25;
    const _height = height||25;
    const _body = Icon? <Icon width={_width} height={_height}/>: children;
    
    return <>
        <button
        className={'btn '+btnType+className}
        onClick={onClick}>
            {_body}
        </button>
    </>;
};

export default Button;
