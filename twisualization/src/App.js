import './App.css';
import {useState} from "react";
import TimestepDropDown from "./components/TimestepDropDown.js";
import TweetviewDropDown from "./components/TweetviewDropDown.js";
import WordCloud from "./components/WordCloud";
import TimeSlider from '../src/components/TimeSlider.js';
import BarChart from './components/BarChart.js';
import PieChart from "./components/PieChart.js";
import TweetView from "./components/TweetView.js";
import WorldMap from "./components/WorldMap.js";

import stylesheet from './components/styles.scss';
import useDebounce from '../src/hooks/useDebounce.js';

import {FaTwitter} from 'react-icons/fa';
import {FaInfo} from 'react-icons/fa';

function App() {

    const [time, setTime] = useState("02/27/2017 23:48:00");
    const [tweets, setTweets] = useState([]);
    const [timestep, setTimestep] = useState("days");
    const [sentiment, setSentiment] = useState("");
    const [tweetsShown, setTweetsShown] = useState(10);
    const debouncedTime = useDebounce(time, 100);

    const handleTimeSlider_Time = (time) => {
        setTime(time);
    };

    const handleTimeSlider_Data = (tweets) => {
        setTweets(tweets);
    };

    const handleTimestepDropDown = (timestep) => {
        setTimestep(timestep);
    }

    const handleTweetviewDropDown = (tweetsShown) => {
        setTweetsShown(tweetsShown);
    }

    const handlePieChart = (sentiment) => {
        setSentiment(sentiment);
    }

    return (
        <div className={stylesheet}>

            <h1 style={{textAlign: 'center', color: '#1da1f2'}}>
                The <text className="clickable" onClick={gotoIncident}>2017 Oscar Incident</text> - A Visualization of
                the Twitter Data <FaTwitter className="clickable" onClick={gotoTwitter}/>
            </h1>

            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <p>Choose the timeframe of the data:</p>
                        <div style={{paddingLeft: '10px', paddingTop: '15px'}}>
                            <TimestepDropDown timestepSelected={handleTimestepDropDown}/>
                        </div>
                    </div>
                    <div style={{paddingTop: '10px'}}>
                        <BarChart timeSelected={debouncedTime} tweetData={tweets} timestepSelected={timestep}/>
                    </div>
                    <div>
                        <TimeSlider timeSelected={handleTimeSlider_Time} tweetData={handleTimeSlider_Data}
                                    timestepSelected={timestep}/>
                    </div>
                    <div>
                        <WordCloud tweetData={tweets} />
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>
                        <WorldMap tweetData={tweets}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{paddingTop: '50px'}}>
                            <PieChart tweetData={tweets} sentimentSelected={handlePieChart}/>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <p>Choose the amount of tweets shown:</p>
                                <div style={{paddingLeft: '10px', paddingTop: '15px'}}>
                                    <TweetviewDropDown tweetAmountShown={handleTweetviewDropDown}/>
                                </div>
                            </div>
                            <div style={{paddingTop: '15px'}}>
                                <TweetView id="tweetpreviewcontainer" tweetData={tweets} sentimentSelected={sentiment}
                                           tweetAmountShown={tweetsShown}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'bottom'}}>
                <FaInfo style={{color: '#1da1f2', fontSize: 20, paddingTop: '5px'}}/>
                <p style={{textAlign: 'center', fontSize: 13}}>
                    The visualization shows data from tweets published in the timeframe of 28th of February to 3rd of March 2017 with the Hashtag #Oscars. This timeframe starts after the 89th Academy Awards, where the movie La La Land was wrongfully announced as the winner for Best Picture instead of the real winner Moonlight.
                    <p style={{color: "lightgrey"}}>
                        created by Hannah Clara Bayat and Joanna Zamiechowska <br/>
                        Visualization 2  - TU Wien, 2021
                    </p>
                </p>
            </div>

        </div>
    );
}

function gotoTwitter() {
    window.open('https://twitter.com', '_blank');
}

function gotoIncident() {
    window.open('https://www.youtube.com/watch?v=GCQn_FkFElI', '_blank');
}

export default App;