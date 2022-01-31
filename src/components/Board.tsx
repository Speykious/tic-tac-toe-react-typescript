import React from 'react';
import Square, { Player } from './Square';

export interface BoardProps {

}

export interface BoardState {
  squares: Player[];
  currentPlayer: Player;
  gameState: 'playing' | 'xWon' | 'oWon' | 'boardFull';
}

export default class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      currentPlayer: 'X',
      gameState: 'playing',
    };
  }

  renderSquare(i: number) {
    return (
      <Square
        character={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  handleClick(i: number) {
    const squares = this.state.squares.slice();
    let { gameState, currentPlayer } = this.state;

    // reset game state if we're not playing
    if (gameState !== 'playing') {
      this.setState({
        squares: Array(9).fill(null),
        currentPlayer: 'X',
        gameState: 'playing',
      });
      return;
    }

    // ignore click if the square is full
    if (squares[i])
      return;

    // fill square with current player and do next turn
    squares[i] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // change game state based on winner or if board is full
    const winner = this.playerWon(squares);
    switch (winner) {
      case 'X': gameState = 'xWon'; break;
      case 'O': gameState = 'oWon'; break;
      default:
        gameState = this.isFull(squares) ? 'boardFull' : 'playing';
        break;
    }
    
    this.setState({
      squares,
      currentPlayer: currentPlayer,
      gameState,
    });
  }

  isFull(squares: Player[] = this.state.squares): boolean {
    for (let i = 0; i < 9; i++)
      if (squares[i] === null)
        return false;
    return true;
  }

  playerWon(squares: Player[] = this.state.squares): Player | null {
    const s = (x: number, y: number) => this.square(x, y, squares);

    for (let i = 0; i < 3; i++) {
      // lines
      const sl0 = s(0, i);
      if (sl0 === s(1, i) && sl0 === s(2, i))
        return sl0;
      // columns
      const sc0 = s(i, 0);
      if (sc0 === s(i, 1) && sc0 === s(i, 2))
        return sc0;
    }

    // diagonals
    const sm = s(1, 1);
    if ((sm === s(0, 0) && sm === s(2, 2))
      && (sm === s(2, 0) && sm === s(0, 2)))
      return sm;
    
    return null;
  }

  square(x: number, y: number, squares: Player[] = this.state.squares): Player | null {
    return squares[3 * y + x];
  }

  render() {
    let status: string;
    switch (this.state.gameState) {
      case 'xWon': status = "Player X won!"; break;
      case 'oWon': status = "Player O won!"; break;
      case 'boardFull': status = "Tie!"; break;
      default: status = `Next player: ${this.state.currentPlayer}`; break;
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
