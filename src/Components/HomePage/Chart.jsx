import React, { useEffect, useRef } from 'react';

const Chart = ({ data }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawChart();
    }, [data]);

    const drawChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set line color and width
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    
    // Move to the initial point
    ctx.beginPath();
    ctx.moveTo(0, mapValueToY(data[0], canvas));
    
    // Draw lines connecting the points
    data.forEach((value, index) => {
        const x = index * 30;
        const y = mapValueToY(value, canvas);
        ctx.lineTo(x, y);
    });
    
    // Stroke the path to draw the lines
    ctx.stroke();
    };
    
    const mapValueToY = (value, canvas) => {
    // Map the value to the y-axis range (adjust the scaling factor as needed)
    const scalingFactor = canvas.height / (2000 - 100);
    return canvas.height - (value - 100) * scalingFactor;
    };

    return <canvas ref={canvasRef} width={300} height={150} />;
};

export default Chart;