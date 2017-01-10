import * as d3 from "d3";
import React, { Component } from 'react';

import Dots from '../elements/Dots';
import Axis from '../elements/Axis';
import Grid from '../elements/Grid';
import ToolTip from '../elements/ToolTip';

class LineChart extends Component{
  constructor() {
    super();
    this.state = {
      tooltip:{
        display:false,
        data:{key:'',value:''}
      }
    };
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }

  showToolTip(e){
      e.target.setAttribute('fill', 'green');
      this.setState({
        tooltip:{
          display:true,
          data: {
            key:e.target.getAttribute('data-key'),
            value:e.target.getAttribute('data-value')
          },
          pos:{
            x:e.target.getAttribute('cx'),
            y:e.target.getAttribute('cy')
          }
        }
      });
  }

  hideToolTip(e){
      e.target.setAttribute('fill', this.props.color);
      this.setState({
        tooltip:{
          display:false,
          data:{key:'',value:''}
        }
      });
  }

  render(){
      let data=this.props.data;
      let svgWidth = this.props.svgWidth;
      let svgHeight = this.props.svgWidth*0.5;
      //console.log("h: "+this.props.height);
      let margin = {top: 10, right: 30, bottom: 20, left: 80},
          w = svgWidth - (margin.left + margin.right),
          h = svgHeight - (margin.top + margin.bottom);


      data.forEach(function (d) {
          d.date = d3.isoParse(d.time);
      });

      /*
      let x = d3.scaleTime()
          .domain(d3.extent(data, function (d) {
              return d.date;
          }))
          .rangeRound([0, w]);
      */
      let x = d3.scaleBand()
              .range([0, w], .1)
              .domain(data.map((d) => d.date ));

      let y = d3.scaleLinear()
          .domain([0,d3.max(data,function(d){
              return d.value;
          })])
          .range([h, 0]);

      let yAxis = d3.axisLeft(y)//.ticks(5);
      let xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(""));
      /*
      .tickValues(
        data.map(function(d,i){
          if(i>0) return d.date;
        }).splice(1))
      .ticks(4);
      */
      /*
      let xGrid = d3.axisBottom(x)
          .ticks(5)
          .tickSize(-h, 0, 0)
          .tickFormat("");
      */
      let yGrid = d3.axisLeft(y).ticks()
          .tickSize(-w, 0, 0)
          .tickFormat("");

      let line = d3.line()
          .x(function (d) {
              return x(d.date) + x.bandwidth()/2;
          })
          .y(function (d) {
              return y(d.value);
          });
          //.curve(d3.curveCatmullRom.alpha(0))

      let transform='translate(' + margin.left + ',' + margin.top + ')';

      return (

              <svg width={svgWidth} height={svgHeight} preserveAspectRatio="xMinYMin meet" >

                  <g transform={transform}>
                    <Grid h={h} grid={yGrid} gridType="y"/>

                    <Axis h={h} axis={yAxis} axisType="y" />
                    <Axis h={h} axis={xAxis} axisType="x" />

                    <path className="line shadow" d={line(data)} strokeLinecap="round" fill="none" stroke={this.props.color} strokeWidth="3" />
                    <Dots data={data} x={x} y={y} color={this.props.color} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} xOffset={x.bandwidth()/2}/>
                    <ToolTip tooltip={this.state.tooltip}/>
                  </g>
              </svg>
      );
  }
}


export default LineChart;