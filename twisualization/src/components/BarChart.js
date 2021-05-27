import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

const BarChart = ({timeSelected, tweetData, timestepSelected}) => {

    // state and ref to svg
    const svgRef = useRef();

    // code runs only if data has been fetched
    useEffect(() => {

        // data processing
        var tweets = new Map([]);

        const SELECTED_TIMESTEP = timestepSelected;
        const timeSelected_complete = timeSelected.toString();

        var string_timestep;
        var time_units;

        var days = false;
        var hours = false;
        var minute = true;

        switch (SELECTED_TIMESTEP) {
            case "days":
                string_timestep = 12;
                time_units = 24;
                days = true;
                break;
            case "hours":
                string_timestep = 15;
                time_units = 60;
                hours = true;
                break;
            case "minutes":
                string_timestep = 18;
                time_units = 60;
                minute = true;
                break;
        }

        var SELECTED_TIME = timeSelected_complete.substring(0, string_timestep - 2);

        for (let i = 0; i < tweetData.length; i++) {

            var current_timestamp = tweetData[i].Date.substring(0, string_timestep + 1);

            if (tweets.has(current_timestamp)) {
                var current_tweetcount = tweets.get(current_timestamp);
                tweets.set(current_timestamp, current_tweetcount + 1);
            } else {
                tweets.set(current_timestamp, 1);
            }

        }

        // data preparation, fill in the empty slots
        if (tweets.size < time_units) {
            for (let i = time_units - 1; i >= 0; i--) {
                var current_timeslot = SELECTED_TIME + (days ? " " : ":") + (i < 10 ? "0" + i : i);
                if (!tweets.has(current_timeslot)) {
                    tweets.set(current_timeslot, 0);
                }
            }
        }


        var svg_height = 300;
        var svg_width = 500;

        const svg = d3.select(svgRef.current)
            .attr('width', svg_width)
            .attr('height', svg_height);

        svg.selectAll('text').remove();
        svg.selectAll('rect').remove();

        var x = 0;
        for (let i = 0; i < tweets.size; i++, x += 4) {
            if (i % 5 === 0) {
                x += 4;
            }
            var index = SELECTED_TIME + (days ? " " : ":") + (i < 10 ? "0" + i : i);
            current_tweetcount = tweets.get(index);
            svg.append('rect')
                .attr('x', x)
                .attr('y', 10)
                .attr('width', 2)
                .attr('height', current_tweetcount)
                .attr('fill', '#1da1f2');

            svg.append('text')
                .attr('x', x)
                .attr('y', 10)
                .attr('font-size', 10)
                .text(function (d) {
                    return i % 5 === 0 ? i : "";
                });
        }

        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [timeSelected, timestepSelected]);

    return <React.Fragment>
        <svg overflow='visible' height={500} width={500} ref={svgRef}/>
    </React.Fragment>;
};

export default BarChart;

