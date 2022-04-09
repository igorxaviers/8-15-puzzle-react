import React from 'react';

class Piece extends React.Component {
    constructor(props) {
        super(props);
    }
    render() { 
        let piece =
            <div className={`piece ${this.props.number === '0' ? 'bg-danger' :''} `}>
                {this.props.number}
            </div>
        return piece;
    }
}

 
export default React.memo(Piece);