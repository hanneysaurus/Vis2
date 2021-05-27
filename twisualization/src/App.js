import './App.css';
import {useState} from "react";
import DropDown from "../src/components/DropDown.js";
import TimeSlider from '../src/components/TimeSlider.js';
import BarChart from './components/BarChart.js';
import PieChart from "./components/PieChart.js";
import TweetView from "./components/TweetView.js";
import stylesheet from './components/styles.scss';
import useDebounce from '../src/hooks/useDebounce.js';

function App() {

    const [time, setTime] = useState("02/27/2017 23:48:00");
    const [tweets, setTweets] = useState([]);
    const [timestep, setTimestep] = useState("minutes");
    const [sentiment, setSentiment] = useState("");
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

    const handlePieChart = (sentiment) => {
        setSentiment(sentiment);
    }

    return (
        <div className={stylesheet}>
            <div>
                <BarChart timeSelected={debouncedTime} tweetData={tweets} timestepSelected={timestep}/>
            </div>
            <div>
                <TimeSlider timeSelected={handleTimeSlider_Time} tweetData={handleTimeSlider_Data}
                            timestepSelected={timestep}/>
            </div>
            <div>
                <DropDown timestepSelected={handleDropDown}/>
            </div>
            <div>
                <PieChart tweetData={tweets} sentimentSelected={handlePieChart}/>
            </div>
            <div>
                <TweetView id="tweetpreviewcontainer" tweetData={tweets} sentimentSelected={sentiment}/>
            </div>

        </div>
    );
}

export default App;