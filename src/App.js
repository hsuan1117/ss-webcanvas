import './App.css';
import Painter from "./components/Painter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPalette} from "@fortawesome/free-solid-svg-icons";

function App() {
    return (
        <div className="App flex flex-col">
            <header className="fixed text-xl bg-blue-200 w-full h-8 p-4 inline-flex justify-start items-center text-gray-700">
                <FontAwesomeIcon icon={faPalette} className={"mr-1"}/> Web 小畫家
            </header>
            <div className={"w-full flex flex-col items-center"}>
                <Painter/>
            </div>
        </div>
    );
}

export default App;
