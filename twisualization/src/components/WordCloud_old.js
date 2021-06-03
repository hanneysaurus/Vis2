//on twisualization level npm install react-tagcloud

import React, {useEffect, useRef} from 'react';
import {TagCloud} from 'react-tagcloud';
import rawdata2 from '../data/Oscar_data_test.json';

const WordCloud_old = () => {

    var strA = '';          // helper string
    var arrayA = [];        // helper array
    var kwordArr = [];      // list of all keywords in selected tweet range
    const dataArray = [];   // contains all unique keywords and counts
    const dataArray2 = [];  // contains a limited number of keywords and counts


// splits and combines the keywords of selected tweets into a single keyword array
    var countJson = Object.keys(rawdata2).length;  // number of json objects in scope
    for (let i = 0; i < countJson; i++) {
        if(rawdata2[i].keywords) {
            strA = rawdata2[i].keywords;
            arrayA = strA.split(",");
            kwordArr = kwordArr.concat(arrayA);
        }
    }


// gets the unique words and their count from the keyword array
// creates the final dataArray used by the word cloud
    function count() {
        kwordArr.sort();
        var currentWord = null;
        var cnt = 0;
        for (var i = 0; i < kwordArr.length; i++) {
            if (kwordArr[i] != currentWord) {
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
        // control here the minimum count to display
        if (cnt > 0) {
            let word = {
                "value": currentWord,
                "count": cnt,
            }
            dataArray.push(word);
        }
    }
    count();

    function limitWords(){
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].count > 1){
                dataArray2.push(dataArray[i]);
            }
        }
    }
    limitWords();

    return <TagCloud
        minSize={20}
        maxSize={40}
        shuffle={true}
        tags={dataArray2}
        //tags={data}
        onClick={tag => alert(`${tag.value} : ${tag.count}`)}  // onClick, onDoubleClick, onMouseMove
        colorOptions={{hue: 'blue', luminosity: 'bright'}}
        style={{
            //position: 'absolute', left: '50%', top: '50%',
            //transform: 'translate(-50%, -50%)',
            justifyContent: "center",
            alignItems: "center",
            textAlign: 'center',
            fontFamily: 'sans-serif',
            //fontSize: 30,
            fontWeight: 'normal',   //bold
            fontStyle: 'normal',    //italic
            padding: 10,            //Padding between tags (px)
            width: '75%',
            //height: '200px',
        }}
    />
}

export default WordCloud_old;