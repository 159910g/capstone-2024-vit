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
