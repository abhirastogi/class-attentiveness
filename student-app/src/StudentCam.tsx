import React from 'react';
import Webcam from 'react-webcam';
import { Guid } from 'guid-typescript';
import axios from 'axios'

interface Props {
}

interface State {
    username: Guid;
    name: string;
    imageData: any;
    interval: number;
}

export class StudentCam extends React.Component<Props, State>{
    constructor(props: Props){
      super(props);
      this.state = {
          username: Guid.create(),
          imageData : null,
          name: "",
          interval: 3000
      };
    }

    /**
     * Convert a base64 string in a Blob according to the data and contentType.
     * 
     * @param b64Data {String} Pure base64 string without contentType
     * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
     * @param sliceSize {Int} SliceSize to process the byteCharacters
     * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
     * @return Blob
     */
    b64toBlob(b64Data : string, contentType : any, sliceSize: any = 512) : Blob{
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
    }

    capture = () => {
      const imgSrc = (this.refs.webcam as any).getScreenshot();
        var block = imgSrc.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // var contentType = 'image/jpeg'
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

        // Convert it to a blob to upload
        var blob = this.b64toBlob(realData, contentType);

        // Create a FormData and append the file with "image" as parameter name
        var formDataToUpload = new FormData();
        formDataToUpload.append("image", blob);
        formDataToUpload.set("user", this.state.username.toString());
        formDataToUpload.set("name", this.state.name)
        if(this.state.name !== "") {
          axios
            .post('https://faceemotionsfa.azurewebsites.net/api/faceEmotionFunction?code=Gs6t1UI8fYRzrBzsh3i2Gs2PfeDLw3VYvIQED31PVO/E558e1cdAHA==',
            // .post('http://localhost:7071/api/faceEmotionFunction',
            formDataToUpload,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
          }
    }
    componentDidMount(){
        // const webcamRef = React.useRef(null);
        setInterval(()=>{
            this.capture();
        }, 3000);
    }
    setName(event : any){
      this.setState({name : event})
    }
    render(){
      return(
        <div>
          <input placeholder="Name" onChange={event => this.setState({name: event.target.value})}></input>
          <br />
          <Webcam 
              audio={false}
              ref = 'webcam'
              screenshotFormat="image/jpeg"
              mirrored = {true}
              />
        </div>
      );
    }
  }
  