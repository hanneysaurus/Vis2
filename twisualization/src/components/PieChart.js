import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

// time for transition between state changes in milliseconds
const transitionDuration = 100;

/** PieChart component that updates everytime a prop changes with a transition animation, takes in a list of data + other optional props
 data prop format example: [{ label: 'FirstObj', color: 'red', value: 1 }, { label: 'SecondObj', color: 'blue', value: 1 }] */
const PieChart = ({
                      width = 300, height = 300, tweetData, sentimentSelected
                  }) => {

    const outerRadius = (width / 2);
    const innerRadius = outerRadius / 3;

    const svgRef = useRef();
    const didMount = useRef(false);

    var pie = d3.pie().sort(null).value((d) => d.value);
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    useEffect(() => {

        // data preparation
        var data;
        var positive_counter = 0;
        var neutral_counter = 0;
        var negative_counter = 0;
        var tweetCount = tweetData.length;

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
                color: 'lightblue',
                fractional: (Math.round((neutral_counter / tweetCount) * 100)) + '%'
            },
            {
                label: "negative",
                value: negative_counter,
                color: 'red',
                fractional: (Math.round((negative_counter / tweetCount) * 100)) + '%'
            }
        ];

        setupContainersOnMount();
        drawPieChart();
        addTextInCenter();

        d3.selectAll('.top_text')
            .text('sentiment distribution of ' + tweetCount + ' tweets');

        didMount.current = true;


        //----- FUNCTION DEFINITIONS -------------------------------------------------------------------------//
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
                    .style('cursor', 'pointer');
                addTextAtTop();

                // container for arcs
                canvas.append('g').classed('arcs', true);
            }
        }

        /** uses enter() and exit() to redraw the piechart every time props change with transitions */
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
                .each(function (d) {
                    this._current = d;
                })
                .on('mouseenter', function (event, d) {
                    d3.selectAll('.arc').attr("opacity", 0.5);
                    d3.select(this)
                        .attr("opacity", 1.0)
                        .append('title')
                        .text(d.data.value + " tweets");

                    d3.selectAll('.center_text')
                        .text(d.data.fractional + " " + d.data.label);

                })
                .on('mouseleave', function (d) {
                    d3.selectAll('.arc').attr("opacity", 1.0);
                    d3.selectAll('.center_text')
                        .text("");
                })
                .on('click', function (event, d){
                    sentimentSelected(d.data.label);
                })

            // exit
            arcs.exit().remove();
        }

        function addTextAtTop() {
            let top_text = d3.select('.piechart_outer_svg')
                .selectAll('.top_text')
                .data([0], (d) => d);

            // adds the top text only when mounting
            top_text
                .enter().append('text')
                .attr('x', width / 2)
                .attr('y', 20)
                .attr('class', 'top_text')
                .style('text-anchor', 'middle')
                .text("");

            top_text.exit().remove();
        }

        function addTextInCenter() {
            let center_text = d3.select('.piechart_outer_svg')
                .selectAll('.center_text')
                .data([0], (d) => d);

            // adds the center text only when mounting
            center_text
                .enter().append('text')
                .attr('x', width / 2)
                .attr('y', height / 2 + 12)
                .attr('class', 'center_text')
                .style('text-anchor', 'middle')
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
