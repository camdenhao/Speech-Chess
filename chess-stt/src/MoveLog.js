//Using the history from ChessBoard Component display the history of moves using a scrollable list adapted from: https://github.com/jwarning/react-scrollable-list
import React, { Component } from "react";
import ReactScrollableList from './listIndex.js'
import './App.css'

class MoveLog extends Component{
    constructor(props){
        super(props);
    }
    render() {
        var counter = 1;
        var index = 0;
        var tempMove = '';
        let listItems = [];
        //in map function, make sure to take different actions depending on if white or black moved 
        this.props.history.map(
            (move) => {
                if(index % 2 == 0){
                    tempMove = move; 
                    listItems.push({id: counter, content: 
                        <div>
                        <p>{counter}. {tempMove}</p>
                        {console.log(index++)}
                    </div> })
                }
                else{
                    listItems.pop()
                    listItems.push({id: counter, content: 
                        <div>
                        <p>{counter}. {tempMove} {move}</p>
                        {console.log(this.props.history)}
                        {console.log(counter++)}
                        {console.log(index++)}
                    </div> })
                }
            }
        );
        return(
            <div>
                <ReactScrollableList
                listItems = {listItems}
                heightOfItem={30}
                maxItemsToRender={100}
                style = {{color: "#333"}}
                />
            </div>          
        )
    }
}
export default MoveLog