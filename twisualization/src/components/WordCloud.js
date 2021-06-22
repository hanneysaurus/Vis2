//on twisualization level npm install react-tagcloud

import React, {useEffect, useRef} from 'react';
import {TagCloud} from 'react-tagcloud';
import * as d3 from 'd3';

/**
 *
 * @param tweetData
 * @param sentimentSelected
 * @param sentimentTag
 * @returns {JSX.Element}
 * @constructor
 */
const WordCloud = ({tweetData, sentimentSelected, sentimentTag}) => {

    var SELECTED_SENTIMENT = "";
    if (sentimentSelected !== undefined) {
        SELECTED_SENTIMENT = sentimentSelected.toString().toUpperCase();
    }

    var sentimentTag = "";

    // UNUSED
    //const svgRef = useRef();
    //const didMount = useRef(false);
    //useEffect(() => {

    let wordHue = '';
    let strA = '';          // helper string
    let arrayA = [];        // helper array
    let kwordArr = [];      // list of all keywords in selected tweet range
    const dataArray = [];   // contains all unique keywords and counts
    const dataArray2 = [];  // contains a limited number of keywords and counts


    if (tweetData.length) {

        /**
         * This builds an array of keywords for selected tweets
         *
         */
        function getSentKwordArr() {
            let countJson = Object.keys(tweetData).length;  // number of json objects in scope
            for (let i = 0; i < countJson; i++) {
                var currentSentiment = tweetData[i].Sentiment_Type;
                if (SELECTED_SENTIMENT === "") {
                    //window.alert(SELECTED_SENTIMENT + ' ' + i + ' ' + tweetData[i].Tweet_ID);
                    if (tweetData[i].Keywords) {
                        strA = tweetData[i].Keywords;
                        arrayA = strA.split(",");
                        kwordArr = kwordArr.concat(arrayA);
                    }
                } else if (currentSentiment === SELECTED_SENTIMENT) {
                    //window.alert(SELECTED_SENTIMENT + ' ' + i + ' ' + tweetData[i].Tweet_ID);
                    if (tweetData[i].Keywords) {
                        strA = tweetData[i].Keywords;
                        arrayA = strA.split(",");
                        kwordArr = kwordArr.concat(arrayA);
                    }
                }
            }
        }
        getSentKwordArr()

        /**
         * This function gets the unique keywords and their count from the keyword array
         * It creates a dataArray used by the TagCloud
         *
         */
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

        /**
         * This is a helper function to sort an array of objects by object property (ex. value: or count:)
         *
         * @param property
         * @returns {function(*, *)}
         */
        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
        dataArray.sort(dynamicSort("-count"));

        /**
         * This function will make a new dataArray with a limited number of items (up to 'limit')
         * This is necessary because there might be thousands of keywords in a selected time
         *
         * @type {number}
         */
        function limitWords() {
            let limit = 30;
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

        // This sets the TagCloud color based on selected sentiment
        switch (SELECTED_SENTIMENT) {
            case "POSITIVE":
                wordHue = 'green'
                break;
            case "NEGATIVE":
                wordHue = 'red'
                break;
            case "NEUTRAL":
                wordHue = 'blue'
                break;
            case "":
                wordHue = 'blue'
                break;
        }
        const options = {
            luminosity: 'bright',
            hue: wordHue,
        }

        // UNUSED
        // This function saves the Tag clicked by user
        function saveTag(v){
            sentimentTag = v;
            // window.alert('sentimentTag inside' + sentimentTag) // for testing
            return sentimentTag;
        }
        //window.alert('sentimentTag outside ' + sentimentTag)  // for testing

        // This returns the React TagCloud
        return <TagCloud
            minSize={17}
            maxSize={40}
            shuffle={true}
            tags={dataArray2}
            //tags={data}
            //onClick={tag => alert(`${tag.value} : ${tag.count}`)}  // onClick, onDoubleClick, onMouseMove
            //onClick={tag => saveTag(`${tag.value}`)}
            colorOptions={options}
            style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: 'center',
                fontFamily: 'sans-serif',
                fontWeight: 'bold',      //bold
                fontStyle: 'normal',     //italic
                //padding: 5,              //Padding between tags (px)
                width: '100%',
                height: '100%'
            }}
        />
    } else {
        return <p style={{textAlign: 'center'}}>
            No Tweets available in this time interval.
        </p>
    }
}

// UNUSED
// , [tweetData, sentimentSelected]);
//
//     return <React.Fragment>
//         <div className="WordCloud"/>
//     </React.Fragment>;
// };

export default WordCloud;