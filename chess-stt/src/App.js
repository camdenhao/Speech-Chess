import React, { Component } from "react";
import './App.css'
import HumanVsHuman from "./ChessBoard";


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      apiResponse:'Speak!',
      //trueMove is the string once we've filtered out the input for a move 
      trueMove: ''
    };
  }
//Repeatedly call API to obtain most recent microphone input 
  async componentDidMount() {
    try {
      setInterval(async () => {
        
        fetch("http://localhost:9000/STTApi")
          .then(res => res.text())
            .then(res => this.setState({apiResponse: res}));
          var moveArray = this.state.apiResponse.split(" ")
          var index = 0
          //parse through input to find "from" keyword, as well as correct for the 'a' misinput error
            for(var i = moveArray.length-1; i >= 0; i--) {
              if(moveArray[i] == 'a') {
                //when saying 'a' followed by a number, the API puts a space in between. This fixes that 
                moveArray[i] += moveArray[i+1]
                moveArray.splice(i+1,1) 
              }
              //save index of last "from" 
              else if (moveArray[i] == 'from') {
                  index = i;
                  break;
              }
          }
          moveArray = moveArray.slice(index+1, index+4);
          var move = '';
          //rekindle move to be structured as "beginningSquare endSquare". I added the space to streamline future design changes
          for(var i = 0; i < moveArray.length; i++){
            move = move + " " + moveArray[i]
          }
          //Set the state for Chessboard component 
          this.setState({trueMove: move});
      }, 50);
    } catch(e) {
      console.log(e);
    }
}
  render() {
    return (
      <div className = "App">
        <p>Here's what you're saying: (Don't worry, it's not saved)</p>
        <p className = "Input">{this.state.apiResponse}</p>
        <div className = "flex-container">
          <div>
            <p className = "rules">Hello! Welcome to voice-automated Chess!<br />
              Press "Begin Game!" For the board to start listening<br />
            </p>
            <p className = "instructions">How to input moves: <br />
                Say "from __ (to/go) __ ", where the blanks are the labels for the squares on the board. Ex: "From d2 go d4"<br />
                The board will only register the move if it is legal<br />
                You can also drag and click if you'd like
            </p>
          </div>
          <HumanVsHuman className = "boardsContainer" move={this.state.trueMove}/>
        </div>
        
      </div>
    );
  }
}

export default App;


