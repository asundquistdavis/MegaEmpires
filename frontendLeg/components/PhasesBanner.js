import React, { useMemo } from "react";
import '/frontend/styles/phasesbanner.scss'
import { title } from "../utilities";

const PhasesBanner = (phaseName, phaseActionNumber, hover, setHover, phases) => {
    
    const n = phases.length;

    const svgs = (width, height, phases) => {

        const currentColor = 'yellow';
        const defaultColor = 'lightblue';
        
        const stepX1 = width/(2*n-1)*2;
        const stepX2 = width/(2*n-1);
        const stepY = 5/6*height;
        const stepT = stepY/5;
        
        const inners = phases.map(({name, hover, setHover}, key)=>
            <svg key={key} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
                <path d={`M${stepX1*(key)-(key>0? stepX2: 0)} 0 l${stepX1-(key===0? stepX2: 0)} 0 l${key!=(n-1)? stepX2: 0} ${stepY} l${-stepX1+(key===(n-1)?stepX2:0)} 0 z`} fill={phaseName===name? currentColor: defaultColor} stroke="black"/>
                <text fontSize=".9rem" fontWeight={400} x={stepX2/2+stepX1*key} y={stepY/2} textAnchor="middle" alignmentBaseline="central">{title(name)}</text>
                {hover? <path fill="transparent" stroke="black" d={`M${stepX1*(key)+stepT} ${stepY} l${stepT/2} ${stepT} l${stepT/2} ${-stepT}`}/>: null}
            </svg>);

        return <svg width={width} height={height}>
            {inners}
        </svg>
    };

    
    const phaseActionName = phaseActionNumber? (phases.filter(phase=>phase.name===phaseName)[0].actions[phaseActionNumber]):'';

    const currentPhase = 
        <div className="phasesBannerCurrentPhase">
            {title(phaseName) + title(phaseActionName? ' - '+ phaseActionName: '')}
        </div>

    const hoverPhase = (phase, key) => 
        <div key={key} className="phasesBannerHoverPhase">
            {phase.actions.map((action, key)=><div key={key} className="phasesBannerHoverPhaseAction" style={(phase.name===phaseName&&key===phaseActionNumber)? {backgroundColor: 'yellow', boxShadow: 'yellow 0 0 3px 3px'}: null}>{title(action)}</div>)}
        </div>;

    return <div className="overBoard card phasesBannerBorder" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        {currentPhase}
        {hover? svgs(100*n, 30, phases): null}
        {phases.map(phase=>phase.hover? hoverPhase(phase): null)}
    </div>
};

export default PhasesBanner;
