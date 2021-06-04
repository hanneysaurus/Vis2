import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const BarChart = ({height = 230, width = 700, timeSelected, tweetData, timestepSelected}) => {
    // changed height from 230

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
        var minute = false;

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

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        svg.selectAll('text').remove();
        svg.selectAll('rect').remove();
        svg.selectAll('line').remove();

        var barchart_height = height - 20;
        var fontsize = 12;
        var space_between_bars = 4;
        var wide_space_between_bars = 2 * space_between_bars;
        var bar_width = (width - ((days ? 24 / 3 : 60 / 5) * wide_space_between_bars)
            - ((days ? 24 : 60) * space_between_bars) - (25))
            / ((days ? 24 : 60));
        var max_tweets = 0;
        var min_tweets = 30000;
        var tweetArray = Array.from(tweets.values());

        for (let i = 0; i < tweetArray.length; i++) {
            if (tweetArray[i] < min_tweets) {
                min_tweets = tweetArray[i];
            }
            if (tweetArray[i] > max_tweets) {
                max_tweets = tweetArray[i];
            }
        }

        var x = 25;
        for (let i = 0; i < tweets.size; i++, x += (space_between_bars + bar_width)) {

            if ((days && i % 3 === 0) || (!days && i % 5 === 0)) {
                x += wide_space_between_bars;
            }
            var index = SELECTED_TIME + (days ? " " : ":") + (i < 10 ? "0" + i : i);
            current_tweetcount = tweets.get(index);
            var bar_height = ((current_tweetcount - min_tweets) / (max_tweets - min_tweets)) * barchart_height;
            if (Number.isNaN(bar_height)){  // this fixes the weird NaN error
                bar_height = 0;
            }

            // bars
            svg.append('rect')
                .attr('x', x)
                .attr('y', (barchart_height - bar_height))
                .attr('width', bar_width)
                .attr('height', bar_height)
                .attr('fill', '#1da1f2')
                .append('title')
                .text(current_tweetcount + " tweets");

            // times
            svg.append('text')
                .attr('x', x + (bar_width / 2))
                .attr('y', height - fontsize/2)
                .attr('font-size', fontsize)
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(function (d) {
                    // returns :second for minutes
                    //          hour:minute for hours
                    //   and    hour:00 for days
                    if (days && i % 3 === 0){
                        return i + ":00";
                    } else if (!days && i % 5 === 0) {
                        if  (minute){
                            return ":" + i;
                        } else {
                            return SELECTED_TIME.substring(SELECTED_TIME.length - 2, SELECTED_TIME.length) + ":" + (i < 10 ? ("0" + i) : i);
                        }
                    }
                    return "";
                });
        }

        // scale
        var line_step = 50;
        if (max_tweets > 5000) {
            line_step = 1000;
        } else if (max_tweets > 2500) {
            line_step = 500;
        } else if (max_tweets > 1000) {
            line_step = 100;
        } else if (max_tweets > 100) {
            line_step = 25;
        } else if (max_tweets > 50) {
            line_step = 10;
        } else if (max_tweets > 25) {
            line_step = 5;
        } else {
            line_step = 2;
        }

        var partition = Math.ceil(max_tweets / line_step);
        var line_height = (line_step * barchart_height) / max_tweets;
        for (let i = 1; i <= partition; i++) {

            svg.append('line')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', barchart_height - ((partition - i) * line_height))
                .attr('y2', barchart_height - ((partition - i) * line_height))
                .style('stroke-dasharray', '3,3')//dashed array for line
                .style('stroke', 'dimgrey');

            svg.append('text')
                .attr('x', 0)
                .attr('y', barchart_height - ((partition - i) * line_height + 2))
                .attr('font-size', fontsize)
                .text((partition - i) * line_step);
        }


        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, [timeSelected, timestepSelected]);

    return <React.Fragment>
        <svg className="BarChart" height={height} width={width} ref={svgRef}/>
    </React.Fragment>;
};

export default BarChart;

