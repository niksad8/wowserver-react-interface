import React, { Component } from 'react'
import {Chart,Legend,TimeScale,Filler,Tooltip, LineController, LineElement, PointElement, LinearScale, Title} from "chart.js";
import "chartjs-adapter-date-fns";

export default class LineGraph extends Component {
    chartRef = React.createRef();
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.options = this.props.options;
    }
    componentDidMount() {
        const myChartRef = this.chartRef.current.getContext("2d");
        Chart.register(TimeScale,LineController, LineElement, PointElement, LinearScale, Title,Filler,Tooltip,Legend);
        new Chart(myChartRef, {
            type: "line",
            data: this.data,
            options: this.options
        });
    }
    render() {
        return (
            <canvas
                id="myChart"
                ref={this.chartRef}
            />
        )
    }
}