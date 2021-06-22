import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

// time for transition between state changes in milliseconds
const transitionDuration = 100;

/**
 * PieChart creates the Piechart component with the specified width and height. When the tweetData gets updated it changes its data and looks.
 * Outputs the selected sentiment that is passed on to the other components.
 * @param width
 * @param height
 * @param tweetData
 * @param sentimentSelected
 * @returns {JSX.Element}
 * @constructor
 * @author Hannah Bayat
 */
const PieChart = ({
                      width = 300, height = 300, tweetData, sentimentSelected
                  }) => {

    const outerRadius = 110;
    const innerRadius = outerRadius / 2.5; // 3
    const fontsize = 16;
    const center_fontsize = 14;
    var isSentimentSelected = false;

    const svgRef = useRef();
    const didMount = useRef(false);

    var pie = d3.pie().sort(null).value((d) => d.value);
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var data;
    var positive_counter = 0;
    var neutral_counter = 0;
    var negative_counter = 0;
    var tweetCount = tweetData.length;

    useEffect(() => {

        // data preparation
        for (let i = 0; i < tweetCount; i++) {
            var currentSentiment = tweetData[i].Sentiment_Type;
            switch (currentSentiment) {
                case "POSITIVE":
                    positive_counter++;
                    break;
                case "NEUTRAL":
                    neutral_counter++;
                    break;
                case "NEGATIVE":
                    negative_counter++;
                    break;
            }
        }

        data = [
            {
                label: "positive",
                value: positive_counter,
                color: 'lightgreen',
                fractional: (Math.round((positive_counter / tweetCount) * 100)) + '%'
            },
            {
                label: "neutral",
                value: neutral_counter,
                color: 'floralwhite',
                fractional: (Math.round((neutral_counter / tweetCount) * 100)) + '%'
            },
            {
                label: "negative",
                value: negative_counter,
                color: 'lightcoral',
                fractional: (Math.round((negative_counter / tweetCount) * 100)) + '%'
            }
        ];

        setupContainersOnMount();
        drawPieChart();
        addTextInCenter();

        d3.selectAll('.top_text')
            .text('Sentiment Distribution of ' + tweetCount + ' Tweets');

        didMount.current = true;


        //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//
        /**
         * setupContainersonMount is called once to set up the initial parts of the piechart
         */
        function setupContainersOnMount() {
            const svg = d3.select(svgRef.current);

            if (!didMount.current) {
                let canvas = svg
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .classed('piechart_outer_svg', true)
                    .append('g')
                    .attr('transform', 'translate(' + height / 2 + ' ' + width / 2 + ')')
                    .classed('piechart_canvas', true)
                    .style('cursor', 'pointer')
                addTextAtTop();

                // container for arcs
                canvas.append('g').classed('arcs', true);
            }
        }

        /**
         * drawPieChart() uses enter() and exit() to redraw the piechart every time props change with transitions
         * */
        function drawPieChart() {
            var arcs = d3.select('.arcs').selectAll("path").data(pie(data));

            // transition arcs when data changes
            arcs.transition().duration(transitionDuration).attrTween("d", arcTween);

            // enter
            var enter = arcs.enter()
                .append("path")
                .attr("class", "arc")
                .attr("d", arc)
                .each(function (d) {
                    this._current = d;
                })
                .attr("fill", function (d) {
                    return d.data.color;
                })
                .attr("stroke", "black")
                .attr("opacity", 1.0)
                .attr("stroke-opacity", 0.1)
                .attr("stroke-width", "3px")
                .each(function (d) {
                    this._current = d;
                })
                .on('mouseenter', function (event, d) {
                    if (!isSentimentSelected) {
                        d3.selectAll('.arc').attr("opacity", 0.3);  // changed from 0.5
                        d3.select(this)
                            .attr("opacity", 1.0);

                        d3.selectAll('.center_text')
                            .text(d.data.fractional + " " + d.data.label);
                    }
                })
                .on('mouseleave', function (d) {
                    if (!isSentimentSelected) {
                        d3.selectAll('.arc').attr("opacity", 1.0);
                        d3.selectAll('.center_text')
                            .text("");
                    }
                })
                .on('click', function (event, d) {
                    if (!isSentimentSelected){
                        d3.selectAll('.arc').attr("opacity", 0.3);
                        d3.select(this)
                            .attr("opacity", 1.0);

                        d3.selectAll('.center_text')
                            .text(d.data.fractional + " " + d.data.label);
                        sentimentSelected(d.data.label);
                        isSentimentSelected = true;
                    } else {
                        isSentimentSelected = false;
                    }
                })
                .append('title')

            // update tooltip
            arcs.select("title").text(function(d) {return d.value + " tweets";});

            // exit
            arcs.exit().remove();

        }

        /**
         * addTextAtTop() sets the text on top of the piechart (title)
         */
        function addTextAtTop() {
            let top_text = d3.select('.piechart_outer_svg')
                .selectAll('.top_text')
                .data([0], (d) => d);

            // adds the top text only when mounting
            top_text
                .enter().append('text')
                .attr('x', width / 2)
                .attr('y', (height - 2 * outerRadius) / 2.7 - fontsize)
                .attr('class', 'top_text')
                .style('text-anchor', 'middle')
                .style('font-size', fontsize)
                .text("");

            top_text.exit().remove();
        }

        /**
         * addTextInCenter() sets the text on top of the piechart (title)
         */
        function addTextInCenter() {
            let center_text = d3.select('.piechart_outer_svg')
                .selectAll('.center_text')
                .data([0], (d) => d);

            // adds the center text only when mounting
            center_text
                .enter().append('text')
                .attr('x', width / 2)
                .attr('y', height / 2 + center_fontsize / 2)
                .attr('class', 'center_text')
                .style('text-anchor', 'middle')
                .style('font-size', center_fontsize)
                .text("");

            center_text.exit().remove();
        }

        // used to interpolate between start and end angle when transitioning
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

    }, [tweetData]);

    return <React.Fragment>
        <div className="PieChart" ref={svgRef}/>
    </React.Fragment>;
};

export default PieChart;
