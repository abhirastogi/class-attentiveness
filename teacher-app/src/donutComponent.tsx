import CanvasJSReact from './canvasjs-2.3.2/canvasjs.react'
import React, { FC, useMemo, useEffect, useState } from 'react';

interface Props{
    data: any
}

interface State{

}
export class DonutComponent extends React.Component<Props, State>{
    constructor(props: Props){
        super(props);
    }
    render(){
        const dataPoint = [
            {
                name:"happiness",
                y: this.props.data["happiness"] * 100
            },
            {
                name:"anger",
                y: this.props.data["anger"] * 100
            },
            {
                name:"sadness",
                y: this.props.data["sadness"] * 100
            },
            {
                name:"neutral",
                y: this.props.data["neutral"] * 100
            },
            {
                name:"contempt",
                y: this.props.data["contempt"] * 100
            },
            {
                name:"disgust",
                y: this.props.data["disgust"] * 100
            },
            {
                name:"surprise",
                y: this.props.data["surprise"] * 100
            },
            {
                name:"fear",
                y: this.props.data["fear"] * 100
            }
        ]
        const options = {
            height:150,
			animationEnabled: true,
			subtitles: [{
				verticalAlign: "center",
				fontSize: 20,
				dockInsidePlotArea: true
			}],
			data: [{
				type: "doughnut",
				indexLabel: "{name}: {y}",
                dataPoints: dataPoint
			}]
		}
        return(
            <CanvasJSReact.CanvasJSChart
                options = {options} />
        )
    }
}
