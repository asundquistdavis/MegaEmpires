import React from "react";
import '/frontend/styles/phasesbanner.scss'

const PhasesBanner = (useHover) => {

    const [hover, toggleHover] = useHover;

    return <div className="overBoard card phasesBannerBorder">
        Phases
        {hover? <div onMouseOverCapture={console.log} onMouseEnter={console.log}>Hovering</div>: null}
    </div>
};

export default PhasesBanner;
