import React from "react";
import '/frontend/styles/button.scss'

const Button = (props) => {
    const {Icon, children, onClick, className, width, height, checked, checkable} = props;

    const btnType = (Icon? 'btnI ': checkable? 'btnC ': 'btnT ')  + ((checkable && checked)? 'checked ': '');
    
    const _width = width||25;
    const _height = height||25;
    const _body = Icon? <Icon width={_width} height={_height}/>: checkable? <div></div>: children;
    
    return <>
        <button
        className={'btn '+btnType+className}
        onClick={onClick}>
            {_body}
        </button>
    </>;
};

export default Button;
