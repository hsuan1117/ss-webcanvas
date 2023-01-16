import './App.css';
import Painter from "./components/Painter";

function App() {
    return (
        <div className="App">
            <header className="bg-gray-700 w-full h-12 inline-flex justify-center items-center text-white">
                Web 小畫家
            </header>
            <div className={"mt-4 w-full flex flex-col items-center"}>
                <div className={"w-24 h-24 bg-blue-800"}></div>
                <Painter/>
            </div>
        </div>
    );
}

export default App;
