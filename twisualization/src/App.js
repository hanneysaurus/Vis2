import './App.css';
import {useState} from "react";
import WordCloud from "../src/components/WordCloud";
import DropDown from "../src/components/DropDown.js";
import TimeSlider from "../src/components/TimeSlider.js";
import BarChart from "../src/components/BarChart.js";
import PieChart from "../src/components/PieChart.js";
import TweetView from "../src/components/TweetView.js";
import stylesheet from "../src/components/styles.scss";
import useDebounce from "../src/hooks/useDebounce.js";

import {FaTwitter} from 'react-icons/fa';
//import {keywords} from "d3/dist/package";

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
            <h1 style={{textAlign: 'center', fontSize: 37, color: '#1da1f2'}}>
                A Visualization of Twitter Data during the Oscar Incident 2017 <FaTwitter className="twittericon"
                                                                                          onClick={gotoTwitter}/>
            </h1>
            <div style={{
                borderStyle: 'solid',
                borderColor: '#1da1f2',
                borderWidth: '5px',
                borderRadius: '25px',
                backgroundColor: 'white',
                padding: '10px',
                display: 'flex',
                flexDirection: 'row'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '730px',
                    backgroundColor: 'white',
                    padding: '10px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginBottom: 'auto'
                }}>
                    <p style={{
                        textAlign: 'center',
                        padding: '5px'
                    }}>
                        Select a time interval and range to view the Tweet data for this topic!
                    </p>
                    <div style={{
                        height: '50px',
                        borderRadius: '25px',
                        padding: '10px',
                        textAlign: 'center',
                    }}>
                        <DropDown timestepSelected={handleDropDown}/>
                    </div>
                    <div style={{backgroundColor: 'white', padding: '10px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <TimeSlider timeSelected={handleTimeSlider_Time} tweetData={handleTimeSlider_Data}
                                    timestepSelected={timestep}/>
                    </div>
                    <div style={{padding: '10px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <BarChart timeSelected={debouncedTime} tweetData={tweets} timestepSelected={timestep}/>
                    </div>
                    <div style={{
                        height: '250px',
                        padding: '10px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingTop: '25px'
                    }}>
                        <WordCloud tweetData={tweets} sentimentSelected={sentiment}/>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', padding: '10px'}}>
                    <div style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: '15px'}}>
                        <PieChart tweetData={tweets} sentimentSelected={handlePieChart}/>
                    </div>
                    <div style={{padding: '5px', marginLeft: 'auto', marginRight: 'auto'}}>
                        <TweetView id="tweetpreviewcontainer" tweetData={tweets} sentimentSelected={sentiment}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function gotoTwitter() {
    window.open("https://twitter.com", "_blank");
}

export default App;