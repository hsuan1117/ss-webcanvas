import './App.css';
import Painter from "./components/Painter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPalette} from "@fortawesome/free-solid-svg-icons";
import {QuestionMarkCircleIcon} from "@heroicons/react/24/outline";
import {useState} from "react";

function App() {
    const [keyboardUsageOpen, setKeyboardUsageOpen] = useState(false);
    return (
        <div className="App flex flex-col">
            <header className="fixed text-xl bg-blue-200 w-full h-8 p-4 inline-flex justify-between items-center text-gray-700">
                <div>
                    <FontAwesomeIcon icon={faPalette} className={"mr-1"}/> Web 小畫家
                </div>
                <QuestionMarkCircleIcon className={"h-6 w-6 ml-2 hover:shadow-2xl hover:ring-1"} onClick={()=>setKeyboardUsageOpen(true)}/>
            </header>
            <div className={"w-full flex flex-col items-center"}>
                <Painter keyboardUsageOpen={keyboardUsageOpen} setKeyboardUsageOpen={setKeyboardUsageOpen}/>
            </div>
        </div>
    );
}

export default App;
