import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const DropDown = ({timestepSelected}) => {

    const svgRef = useRef();

    useEffect(() => {
        var svg = d3.select(svgRef.current)
            .append('select')
            .attr("class", "selection")
            .attr("name", "timestep")
            .on('change', function (d) {
                var selection = d3.select(this).property("value");
                timestepSelected(selection);
            });

        var data = ["minutes", "hours", "days"];
        var dropdown = svg.selectAll("option")
            .data(data)
            .enter()
            .append("option")
            .text(function (d) {
                return d;
            })
            .attr("value", function (d) {
                return d;
            });

    }, []);
    return <div ref={svgRef} height={200} width={200}/>;
}

export default DropDown;