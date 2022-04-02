import React from 'react';

class Piece extends React.Component {
    constructor(props) {
        super(props);
    }
    render() { 
        let piece =
            <div className="piece col">
                {this.props.number}
            </div>
        return piece;
    }
}

 
export default Piece;