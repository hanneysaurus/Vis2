import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const TweetView = ({tweetData, sentimentSelected, tweetAmountShown}) => {

    const divRef = useRef();
    var didMount = useRef(false);

    const SELECTED_SENTIMENT = sentimentSelected.toString().toUpperCase();
    const displayTweetAmount = tweetAmountShown; //TODO: display and add the amount
    // shown to the div in form of "showing X tweets with _____ sentiment"
    //TODO: sort by number of likes or retweets
//    https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object

    useEffect(() => {

        // data preparation
        var currentSentimentTweets = [];

        for (let i = 0; i < tweetData.length; i++) {
            var currentSentiment = tweetData[i].Sentiment_Type;
            var currentTweet = tweetData[i];
            if (currentSentiment === SELECTED_SENTIMENT) {
                currentSentimentTweets.push(currentTweet);
            }
        }

        const margin = {side: 5, top: 5, preview: 10}

        var div;
        var tweetview_group
        var svg_height = 500;
        var svg_width = 400;
        var preview_fontsize = 14;
        var preview_fav_fontsize = 10;
        var preview_height = 100 + 2 * margin.side;
        var preview_width = svg_width + 2 * margin.side;
        var container_height = preview_height - 2 * margin.side;
        var container_width = preview_width - 2 * margin.side;

        d3.selectAll('.tweetview_group').remove();

        div = d3.select(divRef.current)
            .attr('width', svg_width)
            .attr('height', svg_height)

        tweetview_group = div.append('g').attr('class', 'tweetview_group');

        for (let i = 0; i < displayTweetAmount; i++) {

            // tweet preview
            var tweetview = tweetview_group.append('svg')
                .attr('class', 'tweetview' + i)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', preview_width)
                .attr('height', preview_height);

            var tweetcontainer = tweetview.append('rect')
                .attr('class', 'tweetpreview_container' + i)
                .attr('width', container_width)
                .attr('height', container_height)
                .attr('x', margin.side)
                .attr('y', margin.top)
                .attr('rx', 10)
                .attr('ry', 10);

            var tweetFullname = tweetview.append('text')
                .attr('class', 'tweetpreview_fullname' + i)
                .attr('x', margin.preview)
                .attr('y', (margin.preview + preview_fontsize))
                .attr('font-size', preview_fontsize)
                .attr('font-weight', 'bold')
                .style('text-anchor', 'start');

            var tweetScreenname = tweetview.append('text')
                .attr('class', 'tweetpreview_screenname' + i)
                .attr('x', margin.preview)
                .attr('y', margin.preview + preview_fontsize)
                .attr('font-size', preview_fontsize)
                .style('text-anchor', 'start');

            var tweetContent = tweetview.append('text')
                .attr('class', 'tweetpreview_tweettext' + i)
                .attr('x', 2 * margin.preview)
                .attr('y', 2 * margin.preview + 2 * preview_fontsize)
                .attr('font-size', preview_fontsize)
                .style('text-anchor', 'start');

            var tweetFavsAndRTs = tweetview.append('text')
                .attr('class', 'tweetpreview_tweetfavs' + i)
                .attr('x', container_width - margin.preview)
                .attr('y', container_height - margin.preview + preview_fav_fontsize / 2)
                .style('font-size', preview_fav_fontsize)
                .style('text-anchor', 'end');
        }


        // container stroke changes on 'onclick' of the piechart and takes the color of the sentiment that is selected

        switch (SELECTED_SENTIMENT) {
            case "POSITIVE":
                divRef.current.style.borderColor = 'lightgreen';
                break;
            case "NEUTRAL":
                divRef.current.style.borderColor = 'cornsilk';
                break;
            case "NEGATIVE":
                divRef.current.style.borderColor = 'lightcoral';
                break;
            default:
                divRef.current.style.borderColor = 'dimgrey';
                break;
        }


        for (let i = 0; i < displayTweetAmount; i++) {

            d3.selectAll('.tweetpreview_container' + i)
                .style('fill', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return '#1da1f211';
                    }
                    return 'white';
                })
                .style('stroke', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return '#1da1f2';
                    }
                    return 'white';
                })
                .style('stroke-width', 1.5);


            // set onclick function of a preview that leads to the original tweet
            d3.selectAll('.tweetview' + i)
                .on('click', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        var url = "http://twitter.com/" + tweet.Screen_Name + "/status/" + tweet.Tweet_ID;
                        window.open(url, "_blank");
                    }
                })
                .on('mouseenter', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        d3.selectAll('.tweetpreview_container' + i).style('fill', '#1da1f255');
                    }
                })
                .on('mouseleave', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        d3.selectAll('.tweetpreview_container' + i).style('fill', '#1da1f211');
                    }
                })
                .style('cursor', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return 'pointer';
                    }
                })


            // set text of the tweetpreview head
            d3.selectAll('.tweetpreview_fullname' + i)
                .text(function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return tweet.Full_Name + (tweet.Verified === "Yes" ? " ☑" : "");
                    }
                });

            d3.selectAll('.tweetpreview_screenname' + i)
                .text(function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        var string = "";
                        for (let i = 0; i < tweet.Full_Name.length; i++) {
                            string += "\xa0\xa0"
                        }
                        return string + tweet.Screen_Name;
                    }
                });

            // set tweet content
            d3.selectAll('.tweetpreview_tweettext' + i)
                .text(function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return tweet.Tweet_Text;//, preview_width - 2 * margin.preview);
                    }
                    return "";
                })

            // line break for tweet content
            d3.selectAll('.tweetpreview_tweettext' + i)
                .call(wrap, preview_width - 2 * margin.preview);


            // set tweet favorizes and retweets
            d3.selectAll('.tweetpreview_tweetfavs' + i)
                .text(function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return "🔁 " + tweet.Retweets + "\xa0\xa0\xa0💗‌ " + tweet.Favorites;
                    }
                    return "";
                })
        }


        didMount.current = true;

        // function for linebreaking
        // adapted from https://bl.ocks.org/mbostock/7555321
        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    y = parseInt(text.attr("y")),
                    dy = 0,
                    tspan = text.text(null).append("tspan")
                        .attr("x", 2 * margin.preview)
                        .attr("y", y)
                        .attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan")
                            .attr("x", 2 * margin.preview)
                            .attr("y", parseInt(y) + ++lineNumber * (preview_fontsize + 5))
                            .text(word);
                    }
                }
            });
        }


    }, [tweetData, sentimentSelected, tweetAmountShown]);

    return <React.Fragment>
        <div className="TweetView" ref={divRef}/>
    </React.Fragment>
}

export default TweetView;