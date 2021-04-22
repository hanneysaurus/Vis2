import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

const Test = () => {

    // state and ref to svg
    const svgRef = useRef();

    // code runs only if data has been fetched
    useEffect(() => {

        var svg_height = 500;
        var svg_width = 500;

        const svg = d3.select(svgRef.current)
            .attr('width', svg_width)
            .attr('height', svg_height);

        svg.selectAll('text').remove();
        svg.selectAll('rect').remove();

        svg.append('rect')
            .attr('x', svg_width/2 - 50)
            .attr('y', svg_height/2 - 50)
            .attr('width', 100)
            .attr('height', 100)
            .attr('stroke', 'black')
            .attr('fill', 'dodgerblue');

        svg.append('text')
            .attr('x', svg_width/2)
            .attr('y', svg_height/2 + 5)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .style('font-size', 20)
            .text("HELLO???");

        return () => {
            svg.selectAll("svg").exit().remove();
        }


    }, );

    return <React.Fragment>
        <svg overflow='visible' height={500} width={500} ref={svgRef}/>
    </React.Fragment>;
};

export default Test;

