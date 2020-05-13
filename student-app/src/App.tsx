import React from 'react';
import logo from './logo.svg';
import './App.css';
import Webcam from 'react-webcam';
import { StudentCam } from './StudentCam';


function App() {
  return (
    <div className="App">
      <StudentCam username="abhishek" />
    </div>
  );
}

export default App;
