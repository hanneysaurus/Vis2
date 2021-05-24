import React, {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import rawdata from '../data/Oscars17.json';

const TimeSlider = ({height = 180, width = 1000, timeSelected, tweetData, timestepSelected}) => {

    var range = [];
    const SELECTED_TIMESTEP = timestepSelected;

    // state and ref to svg
    const svgRef = useRef();

    var allRangeValues = [];
    var svg;
    var margin = {left: 100, right: 100},
        stroke_width = 20;

    switch (SELECTED_TIMESTEP) {
        case "minutes":
            range = [0, 60 * 24 * 4];
            break;
        case "hours":
            range = [0, 24 * 4];
            break;
        case "days":
            range = [0, 4];
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
                break;
            case "hours":
                range = [0, 24 * 4];
                break;
            case "days":
                range = [0, 4];
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

        const text = svg.append("text")
            .attr('class', 'label')
            .attr('x', width / 2)
            .attr('y', 60)
            .attr('font-size', '60pt')
            .attr('font-family', 'open sans, sans-serif')
            .attr('text-anchor', 'middle')

        const start = svg.append("text")
            .attr("font-weight", function () {
                return 600;
            })
            .attr('x', 50)
            .attr('y', 97)
            .attr('font-size', '16pt')
            .attr('font-family', 'open sans, sans-serif')
            .attr('text-anchor', 'middle')
            .text(rangeValues[0]);

        const end = svg.append("text")
            .attr("font-weight", function () {
                return 600;
            })
            .attr('x', 950)
            .attr('y', 97)
            .attr('font-size', '16pt')
            .attr('font-family', 'open sans, sans-serif')
            .attr('text-anchor', 'middle')
            .text(rangeValues[rangeValues.length - 1]);


        // drag handle
        var handle = slider.append('circle').classed('handle', true)
            .attr('r', stroke_width / 2)
            .attr('fill', 'rgb(101, 101, 108)')
            .attr('fill', 'black');


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

        // set default year to max value, corresponds to 27/02/2017 23:00:00
        dragged(200, range);

        function dragged(value) {

            var x = xScale.invert(value),
                index = 0,
                timeSliderValue;

            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < rangeValues.length; i++) {
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
            text.text(rangeValues[index]);

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


    return <div ref={svgRef} height={500} width={500}/>;
};

export default TimeSlider;
