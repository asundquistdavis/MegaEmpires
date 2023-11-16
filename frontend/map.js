import axios from "axios";

export async function useMap(mapState) {

    const mapFile = await axios.get('./map.html');
    const areasData = await axios.get('./json/map.json');
    mapState.areasData = areasData.data.map(data=>({...data, support: Math.floor(Math.random()*4), population: Math.floor(Math.random()*4)}))
    const div = document.getElementById("map");
    div.innerHTML = mapFile.data;
    
    const paths = Array.from(document.getElementsByTagName('path'));
    const areasUI = paths.filter(path=>(path.getAttribute('type')==='coastal'||path.getAttribute('type')==='land'));
    mapState.areasUI = areasUI;
    const map = document.getElementById('mapSVG');
    const mapWidth = 1600;
    const mapHeight = 552;
    
    let { moving, clicking } = mapState;
    
    let dragging = false
    let tx = 0;
    let ty = 0;
    const zoomMin = 1;
    const zoomMax = 10;
    let zoom = 1; 
    let mapMatrix = [1, 0, 0, 1, 0, 0]

    const transform = () => {
        const boardWidth = document.getElementById('map').offsetWidth;
        const boardHeight = document.getElementById('map').offsetHeight;
        const left = mapWidth/2*(mapMatrix[0]-1);
        const right = boardWidth - mapWidth - left;
        const top = mapHeight/2*(mapMatrix[0]-1);
        const bottom = boardHeight - mapHeight - top;
        if (mapMatrix[4]>left) {mapMatrix[4] = left;}
        if (mapMatrix[4]<right) {mapMatrix[4] = right;}
        if (mapMatrix[5]>top) {mapMatrix[5]=top}
        if (bottom>top) {mapMatrix[5]=top}
        else if (mapMatrix[5]<bottom) {mapMatrix[5]=bottom}
        const matrixArrs = mapMatrix.join(' ');
        return `matrix(${matrixArrs})`;
    }
    
    const handleMouseUpPath = (event) => {
        if (clicking) {
            const selected = document.querySelector('path[selected]');
            const path = event.target;
            const newPath = path.cloneNode(false);
            const selectedHolder = document.querySelector('g[name="selected"]');
            const attrs = Object.values(newPath.attributes).filter(attr=>((attr.name!=='name')&&(attr.name!=='type')&&(attr.name!=="d")));
            mapState.selected = null;
            attrs.forEach(attr=>newPath.removeAttribute(attr.name));
            newPath.setAttribute('selected', '');
            newPath.addEventListener('mouseup', handleMouseUpPath, false);
            if (selected?.getAttribute('name')!==path.getAttribute('name')) {selectedHolder.appendChild(newPath); mapState.selected = newPath};
            selected?.remove();
        };
    };
    
    const handleMouseLeave = (event) => {
        mapState.hovered?.remove()
    };
    
    const handleMouseEnter = (event) => {
        const path = event.target;
        const newPath = path.cloneNode(false);
        const hoveredHolder = document.querySelector('g[name="hovered"]');
        const attrs = Object.values(newPath.attributes).filter(attr=>((attr.name!=='name')&&(attr.name!=='type')&&(attr.name!=="d")));
        attrs.forEach(attr=>newPath.removeAttribute(attr.name));
        path.addEventListener('mouseout', handleMouseLeave, false);
        newPath.setAttribute('hovered', '');
        hoveredHolder.appendChild(newPath);
        mapState.hovered = newPath;
    };
    
    const changeElem = (elem, attr, value) => {
        elem.attributes[attr].value = value;
    };

    const handleScroll = (event) => {
        const zoomDelta = event.deltaY<0? 1: -1
        const zoomTarget = zoom + zoomDelta;
        const boardWidth = document.getElementById('map').offsetWidth;
        if (zoomTarget<zoomMax&&zoomTarget>=zoomMin) {
            const scaleFactor = (zoomDelta===1?1.25:.8);
            zoom = zoomTarget;
            mapMatrix = mapMatrix.map(i=>i*scaleFactor)
            mapMatrix[4] -= (1-scaleFactor)*boardWidth/2
        };
        changeElem(map, 'transform', transform())
    };
    
    const handleMouseDown = (event) => {
        clicking = true;
        moving = true;
    };
    
    const handleMouseMove = (event) => {
        clicking = false;
        if (moving) {
            const dx= event.movementX;
            const dy = event.movementY;
            mapMatrix[4] += dx
            mapMatrix[5] += dy
            changeElem(map, 'transform', transform());
        };
    };
    
    const handleMouseUp = (event) => {
        clicking = false;
        moving = false;
    };
    
    const handleMouseLeaveMap = (event) => {
        moving = false;
    };

    const handleTouchStart = (event) => {
        event.preventDefault()
        dragging = true;
        clicking = true;
        if (event.changedTouches.length === 1) {
            tx = event.changedTouches[0].clientX;
            ty = event.changedTouches[0].clientY;
        };
    };

    const handleTouchMove = (event) => {
        event.preventDefault()
        clicking = false;
        // console.log(event)
        if (event.changedTouches.length === 1) {
            const dx = (event.changedTouches[0].clientX - tx)/10;
            const dy = (event.changedTouches[0].clientY - ty)/10;
            mapMatrix[4] += dx
            mapMatrix[5] += dy
            changeElem(map, 'transform', transform());
        };
    };
;
    
    areasUI.forEach(path => {
        path.addEventListener('mouseup', handleMouseUpPath, false);
        path.addEventListener('mouseover', handleMouseEnter, false);
    });
    
    map.addEventListener('touchstart', handleTouchStart, false);
    map.addEventListener('touchmove', handleTouchMove, false);
    map.addEventListener('mousemove', handleMouseMove, false);
    map.addEventListener('mouseleave', handleMouseLeaveMap, false);
    map.addEventListener('mousedown', handleMouseDown, false);
    map.addEventListener('mouseup', handleMouseUp, false);
    map.addEventListener('mousewheel', handleScroll, false);
};
