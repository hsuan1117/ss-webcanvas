import './App.css';
import Painter from "./components/Painter";

function App() {
    return (
        <div className="App flex flex-col">
            <header className="fixed bg-gray-700 w-full h-12 inline-flex justify-center items-center text-white">
                Web 小畫家
            </header>
            <div className={"mt-12 w-full flex flex-col items-center"}>
                <Painter/>
            </div>
        </div>
    );
}

export default App;
