import React from "react";

const Area = (props) => {
    
    const { areaData, key, scale, mapState, setMapState } = props;
    
    const {points, holePoints, name, color, state, styling, support, supportColor, city, cityColor, type} = areaData;
    
    const highlightStyle = (event) => {
        const area = event.target;
        area.attributes['stroke'].value = 'yellow';
        area.attributes['fill'].value = '#1d1dc2';
        area.attributes['stroke-width'].value = '2px'
    }

    const resetStyle = (event) => {
        const area = event.target;
        area.attributes['stroke'].value = 'black';
        area.attributes['fill'].value = '#2424F2';
        area.attributes['stroke-width'].value = '1px'
    }
    
    
    const _points = points.map(point=>String(point.map(value=>scale*value).join(','))).join(' ');
    
    const _holePoints = holePoints?.map(point=>String(point.map(value=>scale*value).join(','))).join(' ')||'';
 
    const svg =
        <svg key={key}>
            {_holePoints? <defs>
                <mask id={key+'hole'}>
                    <rect width='100%' height='100%' fill="white"/>
                    <polygon points={_holePoints} fill="black"/>
                </mask>
            </defs>:null}
            <polygon 
            id={name} 
            type={type} 
            support={support} 
            mask={_holePoints?`url(#${key}hole)`:''} 
            onMouseOver={highlightStyle} 
            onMouseOut={resetStyle}
            points={_points}
            fillOpacity={.1}
            fill='#2424F2' 
            stroke="black"
            strokeWidth='1px'/>
        </svg>;

    return svg
};

export default Area;
