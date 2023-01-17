import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faEraser,
    faPaintBrush,
    faRectangleList,
    faSquare,
    faTrashCan
} from "@fortawesome/free-solid-svg-icons";

export default function Painter() {
    const canvasRef = useRef(null);
    const [insideCanvas, setInsideCanvas] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({x: 0, y: 0});
    const [mode, setMode] = useState("pen");
    const [history, setHistory] = useState([]);

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    const redo = (pop = true) => {
        if (history.length > 0) {
            if (pop) setHistory(history.slice(0, history.length - 1));
        }
    }

    const preDraw = () => new Promise((resolve) => {
        if(history.length === 0) resolve();
        const canvas = canvasRef.current;
        const ctx = canvasRef.current.getContext("2d");
        const image = new Image();
        image.src = history?.[history.length - 1]
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            resolve();
        }
    })

    const mouseDown = async (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
        await preDraw();
    }

    const mouseUp = (e) => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
        setHistory([...history, canvas.toDataURL()]);
    }

    const mouseMove = async (e) => {
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
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.arc(getMousePos(canvas, e).x, getMousePos(canvas, e).y, 5, 0, Math.PI * 2, false);
                    ctx.fill();
                    setStartPoint(getMousePos(canvas, e));
                    break;
                case "rect":
                    ctx.globalCompositeOperation = "source-over";
                    ctx.fillStyle = "rgb(200,0,0)";
                    await preDraw();
                    ctx.beginPath()
                    ctx.moveTo(startPoint.x, startPoint.y);
                    if (e.shiftKey) {
                        ctx.rect(startPoint.x, startPoint.y, getMousePos(canvas, e).x - startPoint.x, getMousePos(canvas, e).x - startPoint.x);
                    } else {
                        ctx.rect(startPoint.x, startPoint.y, getMousePos(canvas, e).x - startPoint.x, getMousePos(canvas, e).y - startPoint.y);
                    }
                    ctx.fill();
                    break;
                case "ellipse":
                    ctx.globalCompositeOperation = "source-over";
                    ctx.fillStyle = "rgb(200,0,0)";
                    await preDraw();
                    ctx.beginPath()
                    ctx.moveTo(startPoint.x, startPoint.y);
                    if (e.shiftKey) {
                        ctx.arc(startPoint.x, startPoint.y, Math.sqrt(Math.pow(getMousePos(canvas, e).x - startPoint.x, 2) + Math.pow(getMousePos(canvas, e).y - startPoint.y, 2)), 0, Math.PI * 2, false);
                    } else {
                        ctx.ellipse(startPoint.x, startPoint.y, Math.abs(getMousePos(canvas, e).x - startPoint.x), Math.abs(getMousePos(canvas, e).y - startPoint.y), 0, 0, Math.PI * 2);
                    }
                    ctx.fill();
                    break;
            }
        }
    }

    const mouseEnter = () => {
        setInsideCanvas(true);
        switch (mode) {
            case "eraser":
                const canvas = document.createElement('canvas');

                const radius = 5;
                canvas.height = radius * 2;
                canvas.width = radius * 2;
                const context = canvas.getContext('2d');

                context.beginPath();
                context.arc(radius, radius, radius, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                canvasRef.current.style.cursor = `url(${canvas.toDataURL()}) 5 5, auto`;
                break;
            case "rect":
            case "ellipse":
                canvasRef.current.style.cursor = `crosshair`;
                break;
        }
    }

    useEffect(() => {

    }, [insideCanvas, isDrawing, startPoint]);

    const clear = () => {
        setMode('clear')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHistory([]);
        setMode('pen')
    }

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
                <Button onClick={() => setMode('rect')} selected={mode === 'rect'}>
                    <FontAwesomeIcon icon={faSquare} className={"h-6 w-6"}/>
                </Button>
                <Button onClick={() => setMode('ellipse')} selected={mode === 'ellipse'}>
                    <FontAwesomeIcon icon={faCircle} className={"h-6 w-6"}/>
                </Button>
                <Button onClick={clear} selected={mode === 'clear'}>
                    <FontAwesomeIcon icon={faTrashCan} className={"h-6 w-6"}/>
                </Button>
            </div>
            <div className={'mt-20 w-full flex flex-row justify-around'}>
                <canvas ref={canvasRef} className={'border border-gray-700'}
                        height={750}
                        width={750}
                        onMouseEnter={mouseEnter}
                        onMouseLeave={() => setInsideCanvas(false)}
                        onMouseDown={mouseDown}
                        onMouseUp={mouseUp}
                        onMouseMove={mouseMove}
                />
                <div className={'w-1/4 bg-gray-400 flex flex-col'}>

                </div>
            </div>
            <span className={'text-gray-700'}>{insideCanvas ? 'Inside Canvas' : 'Outside Canvas'}</span>
            <span className={'text-gray-700'}>{isDrawing ? 'Drawing' : 'Not Drawing'}</span>
            <span className={'text-gray-700'}>{`Start Point: ${startPoint.x}, ${startPoint.y}`}</span>
            <span className={'text-gray-700'}>Tool: {mode}</span>
        </>
    )
}