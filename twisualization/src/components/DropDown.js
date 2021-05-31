import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';

const DropDown = ({timestepSelected}) => {

    const svgRef = useRef();

    useEffect(() => {

        d3.selectAll('.selection').remove();

        var svg = d3.select(svgRef.current)
            .append('select')
            .attr("class", "selection")
            .attr("name", "timestep")
            .on('change', function () {
                var selection = d3.select(this).property("value");
                timestepSelected(selection);
            })
            .style('cursor', 'pointer');


        var data = ["days", "hours", "minutes"];
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
            .property("selected", function(d){ return d === "days"; });

    }, []);
    return <div ref={svgRef} height={200} width={200}/>;
}

export default DropDown;