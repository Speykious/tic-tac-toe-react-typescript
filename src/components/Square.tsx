import React from 'react';

export type Player = 'O' | 'X';

export interface SquareProps {
  character: Player | null;
  onClick: () => void;
}

export default class Square extends React.Component<SquareProps> {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.character}
      </button>
    );
  }
}
