import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function BarChart({ width, height, data, tilt }){
    const ref = useRef();

    useEffect(() => {
        d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
    }, []);

    useEffect(() => {
        let svg = d3.select(ref.current);
        svg.selectAll('*').remove();
        if(tilt){
            drawTilt();
        } else {
            draw();
        }
    }, [data, tilt]);

    const draw = () => {
        let margin = {top: 20, right: 50, bottom: 30, left: 50};
        let svgWidth = 720, svgHeight = 300;
        let height = svgHeight- margin.top- margin.bottom, width = svgWidth - margin.left - margin.right;
        let sourceNames = [], sourceCount = [];

        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);
        for(let key in data){
            if(data.hasOwnProperty(key)){
                sourceNames.push(key);
                sourceCount.push(parseInt(data[key]));
            }
        }
        x.domain(sourceNames);
        y.domain([0, d3.max(sourceCount, function(d) { return d; })]);

        let svg = d3.select(ref.current);
        svg.attr('height', svgHeight)
            .attr('width', svgWidth);

        svg = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(5))
            ;
                
        // Create rectangles
        let bars = svg.selectAll('.bar')
            .data(sourceNames)
            .enter()
            .append("g");

        bars
            .append('rect')
            // .attr('class', 'bar')
            .attr("x", function(d) { return x(d); })
            .attr("y", function(d) { return y(data[d]); })
            .attr("width", x.bandwidth())
            .transition().duration(1000)
            .attr("height", function(d) { return height - y(data[d]); });
            
        bars.append("text")
            .text(function(d) { 
                return data[d];
            })
            .attr("x", function(d){
                return x(d) + x.bandwidth()/2;
            })
            .attr("y", function(d){
                return y(data[d]) - 5;
            })
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");
            }

    const drawTilt = () => {
        let margin = {top: 20, right: 60, bottom: 30, left: 60};
        let svgWidth = 720, svgHeight = 300;
        let height = svgHeight- margin.top- margin.bottom, width = svgWidth - margin.left - margin.right;
        let sourceNames = [], sourceCount = [];
        
        let x = d3.scaleLinear().rangeRound([0, width]),
            y = d3.scaleBand().rangeRound([0, height]).padding(0.1);
        for(let key in data){
            if(data.hasOwnProperty(key)){
                sourceNames.push(key);
                sourceCount.push(parseInt(data[key]));
            }
        }
        x.domain([0, d3.max(sourceCount, function(d) { return d; })]);
        y.domain(sourceNames);
        
        let svg = d3.select(ref.current);
        svg.attr('height', svgHeight)
           .attr('width', svgWidth);
        
        svg = svg.append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        svg.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(x))
            ;
        
        svg.append("g")
            .call(d3.axisLeft(y))
            ;
                
        // Create rectangles
        let bars = svg.selectAll('.bar')
            .data(sourceNames)
            .enter()
            .append("g");
        
        bars.append('rect')
            .attr('class', 'bar')
            .attr("x", function(d) { return 0; })
            .attr("y", function(d) { return y(d); })
            .attr("width", function(d){return x(data[d])})
            .transition().duration(1000)
            .attr("height", function(d) { return y.bandwidth(); });
            
        bars.append("text")
            .text(function(d) { 
                return data[d];
            })
            .attr("x", function(d){
                return x(data[d]) + 15;
            })
            .attr("y", function(d){
                return y(d) + y.bandwidth() * (0.5 + 0.1); // here 0.1 is the padding scale
            })
            .attr("font-family" , "sans-serif")
            .attr("font-size" , "14px")
            .attr("fill" , "black")
            .attr("text-anchor", "middle");
    }

    return (
        <div className="Chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )
}

export default BarChart;