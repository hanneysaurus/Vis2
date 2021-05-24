import './App.css';
import {useState} from "react";
import DropDown from "../src/components/DropDown.js";
import TimeSlider from '../src/components/TimeSlider.js';
import BarChart from './components/BarChart.js';
import PieChart from "./components/PieChart.js";
import test_stylesheet from './components/BarChart.scss';
import useDebounce from '../src/hooks/useDebounce.js';

function App() {

    const [time, setTime] = useState("02/27/2017 23:48:00");
    const [tweets, setTweets] = useState([]);
    const [timestep, setTimestep] = useState("minutes");
    const debouncedTime = useDebounce(time, 100);

    const handleTimeSlider_Time = (time) => {
        setTime(time);
    };

    const handleTimeSlider_Data = (tweets) => {
        setTweets(tweets);
    };

    const handleDropDown = (timestep) => {
        setTimestep(timestep);
    }

    return (
        <div>
            <div>
                <BarChart timeSelected={debouncedTime} tweetData={tweets} timestepSelected={timestep}/>
            </div>
            <div>
                <TimeSlider timeSelected={handleTimeSlider_Time} tweetData={handleTimeSlider_Data} timestepSelected={timestep}/>
            </div>
            <div>
                <DropDown timestepSelected={handleDropDown}/>
            </div>
            <div>
                <PieChart tweetData={tweets}/>
            </div>
        </div>
    );
}

export default App;
