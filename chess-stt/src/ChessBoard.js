//code adapted from https://codesandbox.io/s/x332zqpkl4?from-embed=&file=/src/Demo.js
import React, { Component } from "react";
import Chess from "chess.js";
import './App.css';
import MoveLog from './MoveLog'
import Chessboard from "chessboardjsx";

class HumanVsHuman extends Component {
  constructor(props){
    super(props);
    this.state = {
      fen: "start",
      // square styles for active drop square
      dropSquareStyle: {},
      // custom square styles
      squareStyles: {},
      // square with the currently clicked piece
      pieceSquare: "",
      // currently clicked square
      square: "",
      // array of past game moves
      history: []
    };
  }
  


  componentDidMount() {
    this.game = new Chess();
  }
  restartGame = () => {
    this.game.reset()
    this.setState({
      fen: 'start',
      dropSquareStyle: {},
      squareStyles: {},
      pieceSquare: "",
      square: "",
      history: []})
  }
  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    this.setState(({ pieceSquare, history }) => ({
      squareStyles: squareStyling({ pieceSquare, history })
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...squareStyling({
            history: this.state.history,
            pieceSquare: this.state.pieceSquare
          })
        };
      },
      {}
    );

    this.setState(({ squareStyles }) => ({
      squareStyles: { ...squareStyles, ...highlightStyles }
    }));
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    // see if the move is legal
    let move = this.game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for simplicity
    });

    // illegal move
    if (move === null) return;
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history(),
      squareStyles: squareStyling({ pieceSquare, history })
    }));
  };
  //We set an interval in order to constantly parse input for a valid move and automatically complete it 
  checkForMoves = () => {
    this.intervalID = setInterval(this.onVoice, 100)
    var x = document.getElementById("start-button");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
  }

  //input from props is of form "beginningSquare endSquare"
  //simply check move with move validation
  onVoice = () => {
    var moveArray = this.props.move.split(" ")
    let move = this.game.move({
      from: moveArray[1],
      to: moveArray[3],
      promotion : "q"
    })
    if (move === null){
      return;
    }
    this.setState(({ history, pieceSquare }) => ({
      fen: this.game.fen(),
      history: this.game.history(),
      squareStyles: squareStyling({ pieceSquare, history }),
    }));
  }
  onMouseOverSquare = square => {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };
  onMouseOutSquare = square => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = square => {
    this.setState({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  onSquareClick = square => {
    this.setState(({ history }) => ({
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square
    }));

    let move = this.game.move({
      from: this.state.pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.setState({
      fen: this.game.fen(),
      history: this.game.history(),
      pieceSquare: ""
    });
  };

  onSquareRightClick = square =>
    this.setState({
      squareStyles: { [square]: { backgroundColor: "deepPink" } }
    });
  render() {
    const { fen, dropSquareStyle, squareStyles } = this.state;
    return (
      <div className = 'flex-container'>
        <Chessboard
            id="humanVsHuman"
            width={600}
            position={fen}
            onDrop={this.onDrop}
            onMouseOverSquare={this.onMouseOverSquare}
            onMouseOutSquare={this.onMouseOutSquare}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
            }}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDragOverSquare={this.onDragOverSquare}
            onSquareClick={this.onSquareClick} 
            onSquareRightClick={this.onSquareRightClick}
          />
          <div>
          <button id = "start-button" onClick = {this.checkForMoves}>Begin Game</button>
          <button onClick = {this.restartGame}>Restart Game</button>
          </div>
          <div>
            <MoveLog history = {this.state.history} />
          </div> 
    </div>
    ) 
  }
}

export default HumanVsHuman

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  };
};
