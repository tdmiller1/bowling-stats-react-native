import React, { Component } from 'react';

class Game extends Component {
  
  render() {
    
    return (
      <tr>
        <td>{this.props.score}</td>
        <td>{this.props.date}</td>
      </tr>
      )
    }
  }

  export default Game;
