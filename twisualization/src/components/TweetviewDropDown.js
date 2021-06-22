import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

/**
 * creates the dropdown for the user to choose the amount of tweets to be shown in the tweetview (10, 50 or 100)
 * and sets the variable tweetAmountShown
 * @param tweetAmountShown
 * @returns {JSX.Element}
 * @constructor
 * @author Hannah Bayat
 */
const TweetviewDropDown = ({tweetAmountShown}) => {

    const svgRef = useRef();

    useEffect(() => {

        d3.selectAll('.tweetview_selection').remove();

        var svg = d3.select(svgRef.current)
            .append('select')
            .attr('class', 'tweetview_selection')
            .on('change', function () {
                var selection = d3.select(this).property("value");
                tweetAmountShown(selection);
            })
            .style('cursor', 'pointer');


        var data = [10, 50, 100];
        var dropdown = svg.selectAll("option")
            .data(data)
            .enter()
            .append("option")
            .text(function (d) {
                return d;
            })
            .attr("value", function (d) {
                return d;
            })
            .property("selected", function(d){ return d === 10; });

    }, []);
    return <div className="TweetviewDropDown" ref={svgRef} height={200} width={200}/>;
}

export default TweetviewDropDown;