import React from 'react';
import Piece from './Piece';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            
            size: 8,
            inicialState:'123046758',
            finalState: this.props.finalState,
            currentState: '',
            stateHistory: [],
            //finalState:'123456780',
        }
    }
    /*
        Tabuleiro
        1  2  3
        0  4  6
        7  5  8
    */

    sortear = () => {

    }

    resolver = () => {

    }

    renderPieces = () => {
        let pieces = [];

        for (let i = 0; i < this.state.inicialState.length; i++) {
            pieces.push(
                <Piece number={this.state.inicialState.charAt(i)}></Piece>
            );
        }

        return pieces;
    }

    render() { 
        
        let saida = 
        <div className="container col-8 mx-auto ">
            <div className="board">
                {this.renderPieces()}
            </div>
        </div>
    
        return saida;
    }
}
 
export default Board;