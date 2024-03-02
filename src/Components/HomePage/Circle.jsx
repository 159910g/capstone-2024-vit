export function updateCircle (svgCanvas, radius, current, total) {

    const svgCanvasWidth = svgCanvas.getBoundingClientRect().width; //get the value of width in pixels
    const svgCanvasHeight = svgCanvas.getBoundingClientRect().height;
    let svgLimitingDimension = svgCanvasHeight

    if(svgCanvasHeight > svgCanvasWidth)
        svgLimitingDimension = svgCanvasWidth;

    const newRad = (radius * (svgLimitingDimension / 2)); //get a radius will fit inside the canvas

    const newCirc = 2 * Math.PI * newRad; //find circumference
    
    let currentPercent = (current/total);

    if(currentPercent > 1)
        currentPercent = 1;

    const newCircPercent = newCirc * currentPercent; //amount of circumference to be filled
    //console.log('circPercent = '+ newCircPercent);

    return { newRad, newCirc, newCircPercent}
}

export const MacroCircle = ({ radius, circ, circPercentage, currentTrackedMacros, macroGoals }) => {
    return (
        <svg className='focused_circle'>
            <circle 
                r={radius} 
                cx="50%" 
                cy="50%" 
                fill="transparent" 
                stroke="lightgrey" 
                strokeWidth="2rem" 
                strokeDasharray={circ} 
                strokeDashoffset="0"/>
            <circle 
                r={radius}
                cx="50%" 
                cy="50%"
                fill="transparent"
                stroke="blue"
                strokeWidth="2rem"
                strokeDasharray={circ}
                strokeDashoffset={circ - circPercentage}
                style={{ transformOrigin: '50% 50%', transform: 'rotate(90deg)' }}/>
            <text className="text_in_circle" x="50%" y="45%" textAnchor="middle"> 
                <tspan x="50%" y="50%">{currentTrackedMacros}/{macroGoals}</tspan>
                <tspan x="50%" y="60%">{((parseFloat((currentTrackedMacros / macroGoals).toFixed(2))) * 100).toFixed(0)}%</tspan> 
            </text>
        </svg>
    );
};

export const MicroCircle = ({ radius, circ, circPercentage, currentTrackedMacros, macroGoals, color }) => {
    return (
        <svg className='unfocused_square'>
            <circle 
                r={radius}
                cx="50%" 
                cy="50%" 
                fill="transparent" 
                stroke="lightgrey" 
                strokeWidth="1rem" 
                strokeDasharray={circ} 
                strokeDashoffset="0"/> 
            <circle 
                r={radius}
                cx="50%" 
                cy="50%" 
                fill="transparent" 
                stroke={color} 
                strokeWidth="1rem" 
                strokeDasharray={circ} 
                strokeDashoffset={circ-circPercentage}
                style={{ transformOrigin: '50% 50%' }} //ensure circle starts from bottom filles clockwise
                transform={`rotate(90)`}/>
            <text className="text_in_circle_unfocused" x="50%" y="45%" textAnchor="middle"> 
                <tspan x="50%" y="50%">{currentTrackedMacros}/{macroGoals}</tspan>
                <tspan x="50%" y="60%">{((parseFloat((currentTrackedMacros / macroGoals).toFixed(2))) * 100).toFixed(0)}%</tspan>
            </text>
        </svg> 
    );
};

