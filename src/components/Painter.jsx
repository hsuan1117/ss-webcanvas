import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircle, faEraser, faFont, faMaximize, faMousePointer,
    faPaintBrush, faRedo,
    faSquare, faTrashCan, faUndo
} from "@fortawesome/free-solid-svg-icons";
import MenuBar from "./MenuBar";
import {HexColorPicker} from "react-colorful";

export default function Painter() {
    const canvasRef = useRef(null);
    const textInput = useRef(null);
    const [insideCanvas, setInsideCanvas] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState({x: 0, y: 0});
    const [currentPoint, setCurrentPoint] = useState({x: 0, y: 0});
    const [mode, setMode] = useState("pen");
    const [history, setHistory] = useState([]);
    const [currentHistoryIdx, setCurrentHistoryIdx] = useState(-1);
    const [askRealClear, setAskRealClear] = useState(false);
    const [filename, setFilename] = useState("untitled.png");
    const [backgroundColor, setBackgroundColor] = useState("transparent");

    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    const redo = () => {
        if (currentHistoryIdx < history.length - 1) {
            setCurrentHistoryIdx(currentHistoryIdx + 1);
            preDraw(currentHistoryIdx + 1)
        }
    }

    const undo = () => {
        if (currentHistoryIdx > 0) {
            setCurrentHistoryIdx(currentHistoryIdx - 1);
            preDraw(currentHistoryIdx - 1)
        }
    }

    /**
     * 重繪當前歷史紀錄的畫面（expensive）
     * */
    const preDraw = (specificHistoryIdx) => new Promise((resolve) => {
        // if (history.length === 0 || currentHistoryIdx <= 0) resolve();
        const canvas = canvasRef.current;
        const ctx = canvasRef.current.getContext("2d");
        const image = new Image();
        if (history.length === 0 || (specificHistoryIdx ?? currentHistoryIdx) < 0) {
            const canvasElement = document.createElement("canvas");
            canvasElement.width = canvas.width;
            canvasElement.height = canvas.height;
            image.src = canvasElement.toDataURL();
        } else {
            image.src = history?.[specificHistoryIdx ?? currentHistoryIdx]
        }
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            resolve();
        }
    })

    const onTextInputBlur = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText(textInput.current.value, currentPoint.x, currentPoint.y);
        textInput.current.value = "";
        textInput.current.classList.add("hidden");
        setIsDrawing(false);
        setHistory([...history, canvas.toDataURL()]);
        setCurrentHistoryIdx(currentHistoryIdx + 1);
        setMode("pen");
        mouseEnter()
    }

    const mouseDown = async (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
        setHistory(history.slice(0, currentHistoryIdx + 1));
        await preDraw();
        if (mode === 'text') {
            textInput.current.classList.remove("hidden");
            textInput.current.style.position = "absolute";
            textInput.current.style.left = canvas.getBoundingClientRect().left + getMousePos(canvas, e).x + "px";
            textInput.current.style.top = canvas.getBoundingClientRect().top + getMousePos(canvas, e).y + "px"
            textInput.current.focus();
        }
    }

    const mouseUp = (e) => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
        setHistory([...history, canvas.toDataURL()]);
        setCurrentHistoryIdx(history.length);
    }

    const mouseMove = async (e) => {
        setCurrentPoint(getMousePos(canvasRef.current, e));
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
                    // 畫 上一張儲存的圖片
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
                    // 畫 上一張儲存的圖片
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
            case "text":
                canvasRef.current.style.cursor = `text`;
                break;
            case "rect":
            case "ellipse":
                canvasRef.current.style.cursor = `crosshair`;
                break;
            case "pen":
            default:
                canvasRef.current.style.cursor = `default`;
                break;
        }
    }

    useEffect(() => {

    }, [insideCanvas, isDrawing, startPoint]);

    const clear = () => {
        if (!askRealClear) {
            setAskRealClear(true);
            return;
        }
        setMode('clear')
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHistory([]);
        setMode('pen')
        setAskRealClear(false);
        setCurrentHistoryIdx(-1)
    }

    const saveFile = () => {
        const canvas = canvasRef.current;
        let dataURL = canvas.toDataURL();
        if (backgroundColor !== "transparent") {
            const newCanvas = document.createElement('canvas');
            newCanvas.width = canvas.width;
            newCanvas.height = canvas.height;
            const newCtx = newCanvas.getContext("2d");

            newCtx.fillStyle = backgroundColor;
            newCtx.fillRect(0, 0, canvas.width, canvas.height);
            newCtx.drawImage(canvas, 0, 0);
            dataURL = newCanvas.toDataURL();
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
    }

    return (
        <>
            <div className={"mt-8 fixed z-50 bg-blue-200 w-full h-12 flex justify-start items-center"}>
                <MenuBar saveFile={saveFile}/>
            </div>
            <div
                className={"mt-20 fixed z-30 bg-gray-100 w-full h-16 px-4 py-4 flex justify-between items-center gap-2"}>
                {/* Toolbar */}
                <div>
                    {/* Place start */}
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
                    <Button onClick={() => setMode('text')} selected={mode === 'text'}>
                        <FontAwesomeIcon icon={faFont} className={"h-6 w-6"}/>
                    </Button>
                    <Button onClick={clear} selected={mode === 'clear'}>
                        <FontAwesomeIcon icon={faTrashCan}
                                         className={`h-6 w-6 ${askRealClear ? 'font-bold text-red-600' : ''}`}/>
                    </Button>
                    <Button onClick={undo} selected={mode === 'undo'}>
                        <FontAwesomeIcon icon={faUndo} className={`h-6 w-6`}/>
                    </Button>
                    <Button onClick={redo} selected={mode === 'redo'}>
                        <FontAwesomeIcon icon={faRedo} className={`h-6 w-6`}/>
                    </Button>
                </div>
                <div>
                    {/* Place end */}

                </div>
            </div>
            <div className={'mt-40 w-full flex flex-row justify-around'}>
                <canvas ref={canvasRef} className={'border border-gray-700'}
                        style={{
                            backgroundColor,
                        }}
                        height={750}
                        width={750}
                        onMouseEnter={mouseEnter}
                        onMouseLeave={() => setInsideCanvas(false)}
                        onMouseDown={mouseDown}
                        onMouseUp={mouseUp}
                        onMouseMove={mouseMove}
                />
                <input type={"text"} className={"hidden"} ref={textInput} onBlur={onTextInputBlur}
                       onKeyDown={(e) => e.key === "Enter" ? onTextInputBlur() : null}/>
                <div className={'w-1/4 bg-gray-400 flex flex-col p-2 gap-2'}>
                    <div className={'text-2xl text-white font-bold'}>設定</div>
                    <div className={"flex flex-row w-full justify-between text-white px-4"}>
                        <span>當前歷史紀錄 ID (0-based)</span>
                        <span>{currentHistoryIdx}</span>
                    </div>
                    <div className={"flex flex-row w-full justify-between text-white px-4"}>
                        <span>歷史紀錄長度</span>
                        <span>{history.length}</span>
                    </div>
                    <div className={"flex flex-row w-full justify-between text-white px-4"}>
                        <span>檔案名稱</span>
                        <input type="text" className={'text-black'} value={filename}
                               onChange={e => setFilename(e.target.value)}/>
                    </div>

                    <div className={"flex flex-row w-full justify-between text-white px-4"}>
                        <span>背景顏色</span>
                        <HexColorPicker color={backgroundColor} onChange={setBackgroundColor}/>
                    </div>
                </div>
            </div>
            <div
                className={"fixed bottom-0 right-0 bg-gray-100 w-full h-8 px-4 py-4 flex justify-between items-center gap-2"}>
                <div className={"flex flex-row gap-2"}>
                    <span className={"pr-8"}><FontAwesomeIcon
                        icon={faMousePointer}/> {Math.floor(currentPoint.x)}, {Math.floor(currentPoint.y)}px</span>
                    {/*<span className={"border-l border-gray-800 px-4"}><FontAwesomeIcon icon={faMousePointer} /> {Math.floor(currentPoint.x)}, {Math.floor(currentPoint.y)}px</span>
                    */}<span className={"border-l border-gray-800 px-4"}><FontAwesomeIcon
                    icon={faMaximize}/> {canvasRef.current?.width ?? 750} x {canvasRef.current?.height ?? 750}px</span>
                </div>
            </div>
        </>
    )
}
