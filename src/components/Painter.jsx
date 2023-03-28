import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faCircle,
    faEraser,
    faFileImage,
    faFont,
    faICursor,
    faMaximize,
    faMousePointer,
    faPaintBrush,
    faRedo,
    faSquare,
    faTrashCan,
    faUndo
} from "@fortawesome/free-solid-svg-icons";
import MenuBar from "./MenuBar";
import {HexColorPicker} from "react-colorful";

export default function Painter() {
    const canvasRef = useRef(null);
    const textInput = useRef(null);
    const inputFileRef = useRef(null);
    const [insideCanvas, setInsideCanvas] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [font, setFont] = useState("Arial");
    const [fontSize, setFontSize] = useState(12);
    const [fontColor, setFontColor] = useState("rgb(0 0 0)");
    const [strokeWidth, setStrokeWidth] = useState(1);
    const [strokeColor, setStrokeColor] = useState("rgb(0 0 0)");
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

    const redo = async () => {
        if (currentHistoryIdx < history.length - 1) {
            setCurrentHistoryIdx(currentHistoryIdx + 1);
            await preDraw(currentHistoryIdx + 1)
        }
    }

    const undo = async () => {
        if (currentHistoryIdx > 0) {
            setCurrentHistoryIdx(currentHistoryIdx - 1);
            await preDraw(currentHistoryIdx - 1);
        } else {
            setCurrentHistoryIdx(-1)
            //setHistory([])
            canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }

    /**
     * 重繪當前歷史紀錄的畫面（expensive）
     * */
    const preDraw = (specificHistoryIdx = currentHistoryIdx) => new Promise((resolve) => {
        // if (history.length === 0 || currentHistoryIdx <= 0) resolve();
        const canvas = canvasRef.current;
        const ctx = canvasRef.current.getContext("2d");
        const image = new Image();
        if (history.length === 0 || specificHistoryIdx < 0) {
            const canvasElement = document.createElement("canvas");
            canvasElement.width = canvas.width;
            canvasElement.height = canvas.height;
            image.src = canvasElement.toDataURL();
        } else {
            image.src = history?.[specificHistoryIdx]
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
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = fontColor;
        ctx.fillText(textInput.current.value, startPoint.x, startPoint.y);
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
        console.log('set by mouse Down')
        setHistory(history.slice(0, currentHistoryIdx + 1));
        if (mode === 'text') {
            textInput.current.classList.remove("hidden");
            textInput.current.style.position = "absolute";
            textInput.current.style.left = canvas.getBoundingClientRect().left + getMousePos(canvas, e).x + "px";
            textInput.current.style.top = canvas.getBoundingClientRect().top + getMousePos(canvas, e).y + "px"
            textInput.current.focus();
        }
        if (mode === 'image') {
            inputFileRef.current.click();
        }
    }

    const mouseUp = (e) => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        setStartPoint(getMousePos(canvas, e));
        console.log('set by mouse up')
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
                    ctx.lineWidth = strokeWidth;
                    ctx.strokeStyle = strokeColor;
                    ctx.beginPath()
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    ctx.stroke();
                    setStartPoint(getMousePos(canvas, e));
                    break;
                case "eraser":
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.arc(e.nativeEvent.offsetX, e.nativeEvent.offsetY, strokeWidth * 0.2 + 5, 0, Math.PI * 2, false);
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

                const radius = strokeWidth * 0.2 + 5;
                canvas.height = radius * 2;
                canvas.width = radius * 2;
                const context = canvas.getContext('2d');

                context.beginPath();
                context.arc(radius, radius, radius, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                context.strokeStyle = 'black';
                context.stroke();
                canvasRef.current.style.cursor = `url(${canvas.toDataURL()}) ${radius} ${radius}, auto`;
                break;
            case "text":
                canvasRef.current.style.cursor = `text`;
                break;
            case "rect":
            case "ellipse":
                canvasRef.current.style.cursor = `crosshair`;
                break;
            case "image":
                canvasRef.current.style.cursor = `copy`;
                break;
            case "pen":
            default:
                canvasRef.current.style.cursor = `default`;
                break;
        }
    }

    useEffect(() => {

    }, [insideCanvas, isDrawing, startPoint]);

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                undo();
            } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
                redo();
            } else if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
                setMode('image')
            } else if (e.key === 'Escape') {
                setMode('pen')
            }
        })
    })

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

        dataToFile(dataURL);
    }

    const dataToFile = (dataURL) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        link.click();
    }

    return (<>
        <div className={"mt-8 fixed z-50 bg-blue-200 w-full h-12 flex justify-start items-center"}>
            <MenuBar saveFile={saveFile}/>
        </div>
        <div
            className={"mt-20 fixed z-30 bg-gray-100 w-full h-16 px-4 py-4 flex justify-between items-center gap-2"}>
            {/* Toolbar */}
            <div className={"flex"}>
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
                    <FontAwesomeIcon icon={faICursor} className={"h-6 w-6"}/>
                </Button>
                <Button onClick={() => setMode('image')} selected={mode === 'image'}>
                    <FontAwesomeIcon icon={faFileImage} className={`h-6 w-6`}/>
                </Button>
                <div className={"inline w-full border border-gray-300 mx-2"}/>
                <div className={"inline-flex items-center gap-2"}>
                    <FontAwesomeIcon icon={faFont} className={"h-6 w-6"}/>
                    <select value={font} className={"text-black rounded-md px-2 py-1"} onChange={(e) => {
                        setFont(e.target.value)
                    }}>
                        {["Arial", "Times New Roman"].map((v, i) => <option key={i} value={v}>{v}</option>)}
                    </select>
                    <select value={fontSize} className={"text-black rounded-md px-2 py-1"} onChange={(e) => {
                        setFontSize(e.target.value)
                    }}>
                        {["8", "9", "10", "12", "14", "16", "18", "20", "22", "24", "28", "30", "36", "48", "72"].map((v, i) =>
                            <option key={i} value={v}>{v}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <Button onClick={clear} selected={mode === 'clear'}>
                    {askRealClear ? <FontAwesomeIcon icon={faCheck}
                                                     className={`h-5 w-5 font-bold text-red-600`}/> :
                        <FontAwesomeIcon icon={faTrashCan}
                                         className={`h-5 w-5 ${askRealClear ? 'font-bold text-red-600' : ''}`}/>}
                </Button>
                <Button onClick={undo} selected={mode === 'undo'}>
                    <FontAwesomeIcon icon={faUndo} className={`h-5 w-5`}/>
                </Button>
                <Button onClick={redo} selected={mode === 'redo'}>
                    <FontAwesomeIcon icon={faRedo} className={`h-5 w-5`}/>
                </Button>
            </div>
        </div>
        <div className={'mt-40 mb-20 w-full flex flex-row justify-around items-start'}>
            <canvas ref={canvasRef} className={'border border-gray-700'}
                    style={{
                        backgroundColor,
                    }}
                    height={500}
                    width={500}
                    onMouseEnter={mouseEnter}
                    onMouseLeave={() => setInsideCanvas(false)}
                    onMouseDown={mouseDown}
                    onMouseUp={mouseUp}
                    onMouseMove={mouseMove}
            />
            <input type={"text"} className={"hidden"} ref={textInput}
                   onKeyDown={(e) => e.key === "Enter" ? onTextInputBlur() : null}/>
            <div className={'w-1/4 bg-gray-400 flex flex-col p-2 gap-3'}>
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
                <div className={"w-full border border-gray-300 my-3"}/>
                <div className={"flex flex-row w-full justify-between text-white px-4"}>
                    <span>字體顏色</span>
                    <div className={"grid grid-cols-5 gap-2"}>
                        <ColorPickerBtn color={"rgb(254 205 211)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(251 207 232)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(245 208 254)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(221 214 254)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(199 210 254)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(191 219 254)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(165 243 252)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(167 243 208)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(187 247 208)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                        <ColorPickerBtn color={"rgb(0 0 0)"} fontColor={fontColor}
                                        setFontColor={setFontColor}/>
                    </div>
                </div>
                <div className={"w-full border border-gray-300 my-3"}/>
                <div className={"flex flex-row w-full justify-between items-center text-white px-4"}>
                    <span>筆跡大小</span>
                    <div className={"inline-flex items-center"}>
                        <input type={"range"} min={1} max={10} value={strokeWidth}
                               onChange={e => setStrokeWidth(e.target.value)}/> {strokeWidth}
                    </div>
                </div>
                <div className={"flex flex-row w-full justify-between text-white px-4"}>
                    <span>筆跡顏色</span>
                    <div className={"grid grid-cols-5 gap-2"}>
                        <ColorPickerBtn color={"rgb(254 205 211)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(251 207 232)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(245 208 254)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(221 214 254)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(199 210 254)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(191 219 254)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(165 243 252)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(167 243 208)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(187 247 208)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                        <ColorPickerBtn color={"rgb(0 0 0)"} fontColor={strokeColor}
                                        setFontColor={setStrokeColor}/>
                    </div>
                </div>
                <div className={"w-full border border-gray-300 my-3"}/>
                <div className={"flex flex-row w-full justify-between text-white px-4"}>
                    <span>背景顏色</span>
                    <HexColorPicker color={backgroundColor} onChange={setBackgroundColor}/>
                </div>
                <input
                    type="file"
                    ref={inputFileRef}
                    className={"hidden"}
                    accept="image/*"
                    onChange={() => {
                        if (inputFileRef.current?.files?.length === 1) {
                            const r = new FileReader();
                            r.onload = function (e) {
                                const canvas = canvasRef.current;
                                const ctx = canvasRef.current.getContext("2d");
                                const image = new Image();
                                image.src = e.target.result
                                image.onload = () => {
                                    //ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(image, startPoint.x, startPoint.y);
                                    setHistory([...history, canvas.toDataURL()]);
                                    setCurrentHistoryIdx(history.length);
                                }
                                // setStartPoint(getMousePos(canvas, e));
                            };
                            r.readAsDataURL(inputFileRef.current.files[0]);
                        } else {
                            console.log("failed");
                        }
                    }}
                />
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
    </>)
}

function ColorPickerBtn({color, fontColor, setFontColor}) {
    return (<div
        className={`cursor-pointer rounded-full h-6 w-6 ${fontColor === color ? 'border-2 border-white shadow-2xl' : ''}`}
        style={{
            backgroundColor: color
        }} onClick={() => {
        console.log(color)
        setFontColor(color)
    }}>
    </div>)
}