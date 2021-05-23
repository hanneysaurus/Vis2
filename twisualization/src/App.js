import './App.css';
import {useState} from "react";
import Test from '../src/components/Test.js';
import TimeSlider from '../src/components/TimeSlider.js';
import DropDown from "../src/components/DropDown.js";
import test_stylesheet from '../src/components/Test.scss';
import useDebounce from '../src/hooks/useDebounce.js';

function App() {

    const [time, setTime] = useState("02/27/2017 23:48:00");
    const [timestep, setTimestep] = useState("minutes");
    const debouncedTime = useDebounce(time, 100);

    const handleTimeSlider = (time) => {
        setTime(time);
    };

    const handleDropDown = (timestep) => {
        setTimestep(timestep);
    }

    return (
        <div>
            <div>
                <Test timeSelected={debouncedTime} timestepSelected={timestep}/>
            </div>
            <div>
                <TimeSlider timeSelected={handleTimeSlider} timestepSelected={timestep}/>
            </div>
            <div>
                <DropDown timestepSelected={handleDropDown}/>
            </div>
        </div>
    );
}

export default App;
