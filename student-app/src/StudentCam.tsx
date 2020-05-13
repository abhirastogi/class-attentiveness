import React from 'react';
import Webcam from 'react-webcam';
import { Guid } from 'guid-typescript';

interface Props {
}

interface State {
    username: Guid;
    imageData: any;
    interval: number;
}

export class StudentCam extends React.Component<Props, State>{
    constructor(props: Props){
      super(props);
      this.state = {
          username: Guid.create(),
          imageData : null,
          interval: 3000
      };
    }

    capture = () => {
        const imgSrc = (this.refs.webcam as any).getScreenshot();
        console.log(imgSrc);
    }
    componentDidMount(){
        // const webcamRef = React.useRef(null);
        setInterval(()=>{
            console.log("abhishek");
            this.capture();
        }, 3000);
    }
    render(){
      return(
        <Webcam 
            audio={false}
            ref = 'webcam'
            />
      );
    }
  }
  