//on twisualization level npm install react-tagcloud

import React, {} from 'react';
import {TagCloud} from 'react-tagcloud';

const WordCloud = ({tweetData}) => {

    let strA = '';          // helper string
    let arrayA = [];        // helper array
    let kwordArr = [];      // list of all keywords in selected tweet range
    const dataArray = [];   // contains all unique keywords and counts
    const dataArray2 = [];  // contains a limited number of keywords and counts

    if (tweetData.length) {

        // combines all keywords from multiple tweets of a selected time into one array
        function getKwordArr() {
            let countJson = Object.keys(tweetData).length;  // number of json objects in scope
            for (let i = 0; i < countJson; i++) {
                if (tweetData[i].keywords) {
                    strA = tweetData[i].keywords;
                    arrayA = strA.split(",");
                    kwordArr = kwordArr.concat(arrayA);
                }
            }
        }
        getKwordArr()

        // gets the unique words and their count from the keyword array
        // creates a dataArray used by the word cloud
        function getCounts() {
            kwordArr.sort();
            let currentWord = null;
            let cnt = 0;
            for (var i = 0; i < kwordArr.length; i++) {
                if (kwordArr[i] !== currentWord) {
                    if (cnt > 0) {
                        let word = {
                            "value": currentWord,
                            "count": cnt,
                        }
                        dataArray.push(word);
                    }
                    currentWord = kwordArr[i];
                    cnt = 1;
                } else {
                    cnt++;
                }
            }
            if (cnt > 0) {
                let word = {
                    "value": currentWord,
                    "count": cnt,
                }
                dataArray.push(word);
            }
        }
        getCounts();

        // helper function to sort an array of objects by object property (ex. value: or count:)
        function dynamicSort(property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        // because there could be thousands of keywords in a selected time
        // this function will make a new dataArray with a limited number of items
        let limit = 50;
        dataArray.sort(dynamicSort("-count"));
        function limitWords() {
            if (limit < dataArray.length) {
                for (let i = 0; i < limit; i++) {
                    dataArray2.push(dataArray[i])
                }
            } else {
                for (let i = 0; i < dataArray.length; i++) {
                    dataArray2.push(dataArray[i])
                }
            }
        }
        limitWords()

        // window.alert('kwordArr.length: ' + kwordArr.length);      // all unique keywords in selection
        // window.alert('dataArray.length: ' + dataArray.length);    // unique keywords and their counts
        // window.alert('dataArray2.length: ' + dataArray2.length);  // unique keywords with count > limit

        return <TagCloud
            minSize={17}
            maxSize={40}
            shuffle={true}
            tags={dataArray2}
            //tags={data}
            onClick={tag => alert(`${tag.value} : ${tag.count}`)}  // onClick, onDoubleClick, onMouseMove
            colorOptions={{hue: 'blue', luminosity: 'bright'}}
            style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontWeight: 'normal',   //bold
                fontStyle: 'normal',    //italic
                padding: 10,            //Padding between tags (px)
                flex: 1
            }}
        />
    } else {
        return <p style={{textAlign: 'center'}}>
            No Tweets available in this time interval.
        </p>
    }

};
export default WordCloud;