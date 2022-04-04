import React from 'react';
import Piece from './Piece';

class Board extends React.Component {
    constructor(props) {
        super(props);

    }

    renderPieces = () => {
        let pieces = [];

        for (let i = 0; i < this.props.currentState.length; i++) {
            pieces.push(
                <Piece key={i} number={this.props.currentState.charAt(i)}></Piece>
            );
        }

        return pieces;
    }

    render() { 
        
        let saida = 
        <div className="container col-8 mx-auto board-container">
            <div className="board">
                {this.renderPieces()}
            </div>
        </div>
    
        return saida;
    }
}
 
export default Board;