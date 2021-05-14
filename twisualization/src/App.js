import './App.css';
import Test from '../src/components/Test.js';
import TimeSlider from '../src/components/TimeSlider.js';
import test_stylesheet from '../src/components/Test.scss';
import useDebounce from '../src/hooks/useDebounce.js';
import {useState} from "react";

function App() {

    const [time, setTime] = useState("02/27/2017 23:48:00");
    const debouncedTime = useDebounce(time, 100);

    const handleTimeSlider = (time) => {
      setTime(time);
    };

  return (
    <div>
        <div>
            <Test timeSelected={debouncedTime}/>
        </div>
        <div>
            <TimeSlider timeSelected={handleTimeSlider}/>
        </div>
    </div>
  );
}

export default App;
