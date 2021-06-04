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
    const[sentimentTag, setSentimentTag] = useState("");

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

    const handleSentimentTag = (sentimentTag) => {
        setSentimentTag(sentimentTag);
    }

    return (
        <div className={stylesheet}>
            <h1 style={{textAlign: 'center', color: '#1da1f2'}}>
                The <text className="clickable" onClick={gotoIncident}>2017 Oscar Incident</text> - A Visualization of
                the Twitter Data <FaTwitter className="clickable" onClick={gotoTwitter}/>
            </h1>
            <div style={{
                borderStyle: 'solid',
                borderColor: '#1da1f2',
                borderWidth: '5px',
                borderRadius: '25px',
                backgroundColor: 'white',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{backgroundColor: 'white',padding: '10px',display: 'flex',  flexDirection: 'row'}}>
                    <div style={{backgroundColor: 'white', width:'55%', display: 'flex',flexDirection: 'column',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        <p style={{textAlign: 'center', paddingTop: '6px'}}>
                            Select a time interval and range to view the Tweet data for this topic!
                        </p>
                        <div style={{height: '50px',borderRadius: '25px',padding: '10px',textAlign: 'center', }}>
                            <TimestepDropDown timestepSelected={handleTimestepDropDown}/>
                        </div>
                        <div style={{paddingTop: '20px', padding: '10px', marginLeft: 'auto', marginRight: 'auto'}}>
                            <BarChart timeSelected={debouncedTime} tweetData={tweets} timestepSelected={timestep}/>
                        </div>
                        <div style={{backgroundColor: 'white', paddingTop: '30px', paddingBottom: '50px', marginLeft: 'auto', marginRight: 'auto'}}>
                            <TimeSlider timeSelected={handleTimeSlider_Time} tweetData={handleTimeSlider_Data}
                                        timestepSelected={timestep}/>
                        </div>
                        <div style={{borderRadius: '25px', backgroundColor: 'white', paddingTop: '10px', margin: 'auto'}}>
                            <WorldMap tweetData={tweets}/>
                        </div>
                    </div>


                    <div style={{backgroundColor: "white", width: '45%', display: 'flex', flexDirection: 'column', padding: '10px', paddingLeft:'30px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <div style={{backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '10', paddingTop: '17px'}}>
                            <PieChart tweetData={tweets} sentimentSelected={handlePieChart}/>
                        </div>
                        <div style={{backgroundColor:'white', paddingTop: '45px', width: '570px', height: '270px',  alignItems: 'center', margin: 'auto', overflowY: 'hidden'}}>
                            <WordCloud tweetData={tweets} sentimentSelected={sentiment}/>
                        </div>
                        <div style={{backgroundColor:'white', display: 'flex', flexDirection: 'row',marginLeft: 'auto', marginRight: 'auto', paddingTop: '10px'}}>
                            <p>Choose the amount of tweets shown:</p>
                            <div style={{paddingTop: '15px'}}>
                                <TweetviewDropDown tweetAmountShown={handleTweetviewDropDown}/>
                            </div>
                        </div>
                        <div style={{backgroundColor:'white', paddingTop: '10px', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center'}}>
                            <TweetView id="tweetpreviewcontainer" tweetData={tweets} sentimentSelected={sentiment}
                                       tweetAmountShown={tweetsShown} tagSelected={sentimentTag}/>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'bottom'}}>
                <FaInfo style={{color: '#1da1f2', fontSize: 20, paddingTop: '5px'}}/>
                <p style={{textAlign: 'center', fontSize: 13}}>
                    The visualization shows data from tweets published in the timeframe of 28th of February to 3rd of
                    March 2017 with the Hashtag #Oscars. This timeframe starts after the 89th Academy Awards, where the
                    movie La La Land was wrongfully announced as the winner for Best Picture instead of the real winner
                    Moonlight.
                    <p style={{color: "lightgrey"}}>
                        created by Hannah Clara Bayat and Joanna Zamiechowska <br/>
                        Visualization 2 - TU Wien, 2021
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