import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import rawdata from '../data/Oscars17.json';

const TimeSlider = ({height = 120, width = 670, timeSelected, tweetData, timestepSelected}) => {
                    // changed height from 180

    var range = [];
    const SELECTED_TIMESTEP = timestepSelected;

    // state and ref to svg
    const svgRef = useRef();

    var allRangeValues = [];
    var svg;
    var margin = {left: 10, right: 10};
    var stroke_width = 20;
    var toptext_fontsize = 24;
    var sidetext_fontsize = 16;
    var cutoff_char = 0;

    switch (SELECTED_TIMESTEP) {
        case "minutes":
            range = [0, 60 * 24 * 4];
            cutoff_char = 16;         //display like this: "02/27/2017 23:48"
            break;
        case "hours":
            range = [0, 24 * 4];
            cutoff_char = 12;         //display like this: "02/27/2017 23:00"
            break;
        case "days":
            range = [0, 4];
            cutoff_char = 9;         //display like this: "02/27/2017"
            break;
    }

    // called only on first mount to fetch data and set it to state
    useEffect(() => {

        for (let k = 0; k < 4; k++) {
            for (let j = 0; j < 24; j++) {
                for (let i = 0; i < 60; i++) {
                    allRangeValues[(k * 24 + j) * 60 + i] = (k < 2 ? "02/" + (27 + k) : "03/0" + (-1 + k)) + "/2017 " + (j < 10 ? "0" : "") + j + ":" + (i < 10 ? "0" : "") + i + ":00";
                }
            }
        }

        var rangeValues = [];

        switch (SELECTED_TIMESTEP) {
            case "minutes":
                range = [0, 60 * 24 * 4];
                cutoff_char = 16;         //display like this: "02/27/2017 23:48"
                break;
            case "hours":
                range = [0, 24 * 4];
                cutoff_char = 13;         //display like this: "02/27/2017 23:00"
                break;
            case "days":
                range = [0, 4];
                cutoff_char = 10;         //display like this: "02/27/2017"
                break;
        }

        for (let i = 0; i < range[1]; i++) {
            rangeValues[i] = allRangeValues[i * (allRangeValues.length / range[1])];
        }

        d3.selectAll('.timeslider').remove();

        // append svg
        svg = d3.select(svgRef.current)
            .append("svg")
            .attr('class', 'timeslider')
            .attr("height", height)
            .attr("width", width);

        let slider = svg.append('g')
            .classed('slider', true)
            .attr('transform', 'translate(' + margin.left + ', ' + (height / 2) + ')');

        // using clamp here to avoid slider exceeding the range limits
        var xScale = d3.scaleLinear()
            .domain(range)
            .range([0, width - margin.left - margin.right])
            .clamp(true);

        var xAxis = d3.axisBottom(xScale).tickValues(rangeValues).tickFormat(function (d) {
            return d;
        });

        // main bar with a stroke
        var track = slider.append('line').attr('class', 'track')
            .attr('x1', xScale.range()[0])
            .attr('x2', xScale.range()[1]);

        // bar that's inside the main track to make it look like a rect with a border
        d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-inset')
            .attr('stroke', 'rgba(101, 101, 108, 0.4)')
            .attr('stroke-width', 5)
            .attr('stroke-linecap', 'round');

        const text = svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2)
            .attr('y', height / 4)  // changed from 3 to raise the text a little
            .attr('font-size', toptext_fontsize)
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle');

        svg.append('title').text('timezone UTC-5');

        const start = svg.append("text")
            .attr('x', margin.left)
            .attr('y', 2 * height/2.7)
            .attr('font-size', sidetext_fontsize)
            .attr('font-width', 'bold')
            .attr('text-anchor', 'start')
            .text(rangeValues[0].substring(0, cutoff_char) + (cutoff_char === 13 ? ":00" : ""));

        const end = svg.append("text")
            .attr('x', width - margin.right)
            .attr('y', 2 * height/2.7)
            .attr('font-size', sidetext_fontsize)
            .attr('font-width', 'bold')
            .attr('text-anchor', 'end')
            .text(rangeValues[rangeValues.length - 1].substring(0, cutoff_char) + (cutoff_char === 13 ? ":00" : ""));


        // drag handle
        var handle = slider.append('circle').classed('handle', true)
            .attr('r', stroke_width / 2)
            .attr('fill', '#c3e6fc')
            .attr('stroke', '#1da1f2');

        // bar on top with stroke = transparent and on which the drag behaviour is actually called
        d3.select(slider.node().appendChild(track.node().cloneNode())).attr('class', 'track-overlay')
            .attr("stroke", "#e73a4e")
            .attr("stroke-width", 15)
            .attr("stroke-opacity", 0)
            .attr("cursor", "grab")
            .attr('stroke-linecap', 'round');

        // create drag handler function
        var dragHandler = d3.drag().on("drag", (event) => {
            dragged(event.x);
        }).on("start", event => {
            dragged(event.x);
        });

        // attach the drag handler to the track overlay
        dragHandler(slider.select(".track-overlay"));

        // set default year to max value, corresponds to 27/02/2017 23:59:00
        dragged(170, range);

        function dragged(value) {

            var x = xScale.invert(value),
                index = 0,
                timeSliderValue;

            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < range[1]; i++) {
                if (x >= i && x <= i + 1) {
                    index = i;
                    break;
                }
            }
            timeSliderValue = rangeValues[index];

            if (handle.attr('cx') !== xScale(x)) {
                timeSelected(timeSliderValue);
                fetchData(timeSliderValue);
            }
            handle.attr('cx', xScale(x));
            d3.selectAll('.label').text(rangeValues[index].substring(0, cutoff_char) + (cutoff_char === 13 ? ":00" : ""));

        }

        function fetchData(timeSliderValue){

            var tweets = [];

            var string_timestep;

            switch (SELECTED_TIMESTEP) {
                case "days":
                    string_timestep = 12;
                    break;
                case "hours":
                    string_timestep = 15;
                    break;
                case "minutes":
                    string_timestep = 18;
                    break;
            }

            var SELECTED_TIME = timeSliderValue.substring(0, string_timestep - 2);

            for (let i = 0; i < rawdata.length; i++) {

                var timestamp = rawdata[i].Date.substring(0, string_timestep - 2);

                if (timestamp === SELECTED_TIME) {
                    tweets.push(rawdata[i]);
                }
            }

            tweetData(tweets);

        }

    }, [SELECTED_TIMESTEP]);


    return <div className="TimeSlider" ref={svgRef} height={height} width={width}/>;
};

export default TimeSlider;
