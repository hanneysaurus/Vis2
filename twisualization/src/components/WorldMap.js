import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {feature} from 'topojson'
import mappingdata from '../data/country_to_map_mapping.csv';

const WorldMap = ({width = 735, height = 500, tweetData}) => {

    console.log(mappingdata)
    // state and ref to svg
    const svgRef = useRef();
    var didMount = useRef(false);

    var svg;
    var projection;
    var colorScale;
    var pathGenerator;

    var countryData = new Map([]);

    // code runs only if data has been fetched
    useEffect(() => {

        for (let i = 0; i < tweetData.length; i++) {
            var currentCountry = tweetData[i].Country;
            if (countryData.has(currentCountry)) {
                countryData.set(currentCountry, countryData.get(currentCountry) + 1);
            } else {
                countryData.set(currentCountry, 1);
            }
        }

        var max_tweets = 0;
        var countryArray = Array.from(countryData.values());
        for (let i = 0; i < countryArray.length; i++) {
            var currentTweetcount = countryArray[i];
            if (currentTweetcount > max_tweets) {
                max_tweets = currentTweetcount;
            }
        }

        console.log(max_tweets);

        svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'map');

        projection = d3.geoNaturalEarth1()
            .scale(width / 6) // this parameter i really just found by trying out different values (apparently there is no way to easily compute the value one needs here)
            .translate([width / 2, height / 2]);

        colorScale = d3.scaleLinear()
            .domain([0, max_tweets])
            .range(['#ffffff', '#1da1f2'])

        pathGenerator = d3.geoPath().projection(projection);
        svg.append('path')
            .attr('class', 'sphere')
            .attr('d', pathGenerator({type: 'Sphere'}))
            .attr('fill', '#1da1f222');

        // WHAT HAPPENED TO AFGHANISTAN AND ANGOLA????
        d3.json("https://unpkg.com/world-atlas@1/world/110m.json")
            .then(data => {
                const countries = feature(data, data.objects.countries);
                svg.selectAll('path')
                    .data(countries.features)
                    .enter().append('path')
                    .attr('d', pathGenerator)
                    .attr('id', function (d) {
                        return d.id
                    })
                    .style('fill', function (d) {
                        return 'lightgrey';
                    })
                    .style('stroke', 'white')
                    .style('stroke-width', 0.5)
            });

        d3.csv('data/country_to_map_mapping.csv').then(function (mapping) {
            console.log(mapping)
            svg.selectAll('path')
                .style('fill', function () {
                    /*if (this.id === id && dimension !== "") {
                        return colors[dimension];
                    } else {
                        return d3.select(this).style("fill");
                    }*/
                    return'white';
                });
        });


    }, [tweetData]);

    return <React.Fragment>
        <svg className="WorldMap" height={height} width={width} ref={svgRef}/>
    </React.Fragment>;
};

export default WorldMap;