import * as d3 from "d3";
import React, { Component } from 'react';

import GridNAxis from '../elements/GridNAxis';
import Bars from '../elements/Bars';

class BarChart extends Component{
  constructor() {
    super();
    this.state = {
      tooltip:{
        display:false,
        data:{key:'',value:''}
      }
    };
  }

  render(){
    let data=this.props.data;
    let svgWidth = this.props.svgWidth;
    let svgHeight = this.props.svgWidth*0.5;
    let margin = {top: 10, right: 30, bottom: 25, left: 80};
    let w = svgWidth - (margin.left + margin.right);
    let h = svgHeight - (margin.top + margin.bottom);

    data.forEach((d) => {
        d.date = d3.isoParse(d.time);
    });

    let x = d3.scaleBand()
        .range([0, w], .1)
        .domain(data.map((d) => d.date ));

    let y = d3.scaleLinear()
        .domain([0,d3.max(data, (d) => ( d.value ))])
        .range([h, 0]);

    let transform='translate(' + margin.left + ',' + margin.top + ')';

    return (
      <div className="svgWrapper">
        <svg width={svgWidth} height={svgHeight} preserveAspectRatio="xMinYMin meet">
          <g transform={transform}>
            <GridNAxis x={x} y={y} w={w} h={h} xAxis={true} yAxis={true} xGrid={false} yGrid={true} />

            <Bars h={h} data={data} x={x} y={y} color={this.props.color} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip} />
          </g>
          {(this.props.xLabel==="")?"":<g><text x={svgWidth/2} y={svgHeight}>{this.props.xLabel}</text></g>}
          {(this.props.yLabel==="")?"":<g><text x={15} y={svgHeight/2}>{this.props.yLabel}</text></g>}
        </svg>
      </div>
    );
  }
}

export default BarChart;
