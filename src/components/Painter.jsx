import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEraser, faPaintBrush} from "@fortawesome/free-solid-svg-icons";

export default function Painter() {
    const canvasRef = useRef(null);
    const [insideCanvas, setInsideCanvas] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({x: 0, y: 0});
    const [mode, setMode] = useState("pen");

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    const mouseDown = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
    }

    const mouseUp = (e) => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
    }

    const mouseMove = (e) => {
        if (isDrawing && insideCanvas) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            switch (mode) {
                case "pen":
                    ctx.globalCompositeOperation = "source-over";
                    ctx.fillStyle = "rgb(200,0,0)";
                    ctx.beginPath()
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(getMousePos(canvas, e).x, getMousePos(canvas, e).y);
                    ctx.stroke();
                    setStartPoint(getMousePos(canvas, e));
                    break;
                case "eraser":
                    ctx.globalCompositeOperation = "source-over";
                    //ctx.globalCompositeOperation = "destination-out";
                    ctx.fillStyle = "rgb(0,200,0)";
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.arc(getMousePos(canvas, e).x, getMousePos(canvas, e).y, 0.1, 0, Math.PI * 2, false);
                    ctx.fill();
                    setStartPoint(getMousePos(canvas, e));
            }

        }
    }

    useEffect(() => {

    }, [insideCanvas, isDrawing, startPoint]);

    return (
        <>
            <div className={"fixed bg-gray-100 w-full h-16 px-4 py-4 flex items-center gap-2"}>
                {/* Toolbar */}
                <Button onClick={() => setMode('pen')} selected={mode === 'pen'}>
                    <FontAwesomeIcon icon={faPaintBrush} className={"h-6 w-6"}/>
                </Button>
                <Button onClick={() => setMode('eraser')} selected={mode === 'eraser'}>
                    <FontAwesomeIcon icon={faEraser} className={"h-6 w-6"}/>
                </Button>
            </div>
            <canvas ref={canvasRef} className={'mt-20 border border-gray-700'}
                    height={750}
                    width={750}
                    onMouseEnter={() => setInsideCanvas(true)}
                    onMouseLeave={() => setInsideCanvas(false)}
                    onMouseDown={mouseDown}
                    onMouseUp={mouseUp}
                    onMouseMove={mouseMove}
            />
            <span className={'text-gray-700'}>{insideCanvas ? 'Inside Canvas' : 'Outside Canvas'}</span>
            <span className={'text-gray-700'}>{isDrawing ? 'Drawing' : 'Not Drawing'}</span>
            <span className={'text-gray-700'}>{`Start Point: ${startPoint.x}, ${startPoint.y}`}</span>
            <span className={'text-gray-700'}>Tool: {mode}</span>
        </>
    )
}