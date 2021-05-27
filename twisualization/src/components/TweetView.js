import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const TweetView = ({tweetData, sentimentSelected}) => {

    const divRef = useRef();
    var didMount = useRef(false);

    const SELECTED_SENTIMENT = sentimentSelected.toString().toUpperCase();
    const displayTweetAmount = 50;

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
        var svg_height = 500;
        var svg_width = 400;
        var container = d3.selectAll('.tweetViewContainer');
        var preview_height = 100;
        var preview_fontsize = 14;
        var preview_fav_fontsize = 10;
        var preview_width = svg_width - 4 * margin.side;

        if (!didMount.current) {
            div = d3.select(divRef.current)
                .attr('width', '500px')
                .attr('height', '500px')
            //.attr('overflow-y', 'scroll');

            // container
            /*div.append('svg').append('rect')
                .attr('width', svg_width)
                .attr('height', svg_height)
                .attr('class', 'tweetViewContainer')
                .attr('fill', 'white')
                .style('stroke', 'black')
                .style('stroke-width', 7);*/

            /*var scrollable = div.append('g')
                .attr('class', 'scrollable')
                .attr('width', svg_width)
                .attr('height', svg_height)
                .attr('x', 0)
                .attr('y', 0);*/

            for (let i = 0; i < displayTweetAmount; i++) {

                // tweet preview
                var tweetview = div.append('svg')
                    .attr('class', 'tweetview' + i)
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', preview_width)
                    .attr('height', preview_height)
                    //.attr('transform', 'translate(' + margin.side + ', ' + margin.top + ')')
                    .style('cursor', 'pointer');

                var tweetcontainer = tweetview.append('rect')
                    .attr('class', 'tweetpreview_container' + i)
                    .attr('width', preview_width)
                    .attr('height', preview_height)
                    .attr('x', margin.side)
                    .attr('y', margin.top);//+ i * (preview_height + margin.preview));

                var tweetFullname = tweetview.append('text')
                    .attr('class', 'tweetpreview_fullname' + i)
                    .attr('x', margin.preview)
                    .attr('y', /*(i * (preview_height + margin.preview)) + */(margin.preview + preview_fontsize))
                    .attr('font-size', preview_fontsize)
                    .attr('font-weight', 'bold')
                    .style('text-anchor', 'start');

                var tweetScreenname = tweetview.append('text')
                    .attr('class', 'tweetpreview_screenname' + i)
                    .attr('x', margin.preview)
                    .attr('y', /*(i * (preview_height + margin.preview)) + */(margin.preview + preview_fontsize))
                    .attr('font-size', preview_fontsize)
                    .style('text-anchor', 'start');

                var tweetContent = tweetview.append('text')
                    .attr('class', 'tweetpreview_tweettext' + i)
                    .attr('x', 2 * margin.preview)
                    .attr('y', /*(i * (preview_height + margin.preview)) + */(2 * margin.preview + 2 * preview_fontsize))
                    .attr('font-size', preview_fontsize)
                    .style('text-anchor', 'start');

                var tweetFavsAndRTs = tweetview.append('text')
                    .attr('class', 'tweetpreview_tweetfavs' + i)
                    .attr('x', preview_width - margin.preview)
                    .attr('y', /*(i * (preview_height + margin.preview)) +*/ (preview_height - margin.preview + preview_fav_fontsize / 2))
                    .style('font-size', preview_fav_fontsize)
                    .style('text-anchor', 'end');
            }
        }


        // container stroke changes on 'onclick' of the piechart and takes the color of the sentiment that is selected

        switch (SELECTED_SENTIMENT) {
            case "POSITIVE":
                divRef.current.style.borderColor = 'lightgreen';
                break;
            case "NEUTRAL":
                divRef.current.style.borderColor = 'lightblue';
                break;
            case "NEGATIVE":
                divRef.current.style.borderColor = 'red';
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
                        return '#1da1f244';
                    }
                    return 'white';
                })
                .style('stroke', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        return 'darkgrey';
                    }
                    return 'white';
                });


            // set onclick function of a preview that leads to the original tweet
            d3.selectAll('.tweetview' + i)
                .on('click', function () {
                    var tweet = currentSentimentTweets[i];
                    if (tweet !== undefined) {
                        var url = "http://twitter.com/" + tweet.Screen_Name + "/status/" + tweet.Tweet_ID;
                        window.open(url, "_blank");
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

        //setScrollable();


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


    }, [sentimentSelected]);

    return <React.Fragment>
        <div className="TweetView" ref={divRef}/>
    </React.Fragment>
}

export default TweetView;