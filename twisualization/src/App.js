import './App.css';
import {useState} from "react";
import WordCloud from "./components/WordCloud";
import WordCloud_old from "./components/WordCloud_old";
import DropDown from "../src/components/DropDown.js";
import TimeSlider from '../src/components/TimeSlider.js';
import BarChart from './components/BarChart.js';
import PieChart from "./components/PieChart.js";
import TweetView from "./components/TweetView.js";
import stylesheet from './components/styles.scss';
import useDebounce from '../src/hooks/useDebounce.js';

import {FaTwitter} from 'react-icons/fa';
import {keywords} from "d3/dist/package";

function App() {

    const [time, setTime] = useState("02/27/2017 23:48:00");
    const [tweets, setTweets] = useState([]);
    const [timestep, setTimestep] = useState("days");
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
            <h1 style={{textAlign: 'center', color: '#1da1f2'}}>
                The Oscar Incident 2017 - A Visualization of the Twitter Data <FaTwitter className="twittericon" onClick={gotoTwitter}/>
            </h1>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>
                        <DropDown timestepSelected={handleDropDown}/>
                    </div>
                    <div>
                        <TimeSlider timeSelected={handleTimeSlider_Time} tweetData={handleTimeSlider_Data}
                                    timestepSelected={timestep}/>
                    </div>
                    <div>
                        {/*<WordCloud_old/>*/}
                        <WordCloud tweetData={tweets} />
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>
                        <BarChart timeSelected={debouncedTime} tweetData={tweets} timestepSelected={timestep}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                            <PieChart tweetData={tweets} sentimentSelected={handlePieChart}/>
                        </div>
                        <div style={{paddingTop: '15px'}}>
                            <TweetView id="tweetpreviewcontainer" tweetData={tweets} sentimentSelected={sentiment}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function gotoTwitter(){
    window.open("https://twitter.com", "_blank");
}
export default App;