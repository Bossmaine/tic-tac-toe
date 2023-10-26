import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import GameOver from "./components/GameOver";
import { useState } from "react";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winingCombination";
import Confetti from "react-confetti";
import WinSound from './assets/mixkit-animated-small-group-applause-523.mp3'
import ClickSound from './assets/mixkit-arcade-game-jump-coin-216.mp3'

const isSpeechSynthesisSupported = 'speechSynthesis' in window;
const isAudioSupported = 'Audio' in window;

const winSound = isAudioSupported ? new Audio(WinSound) : null;
const clickSound = isAudioSupported ? new Audio(ClickSound) : null;

const initialBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const announceWinner = (text) => {
  if (isSpeechSynthesisSupported) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.log('Text-to-speech is not supported in this browser.');
  }
};

function getPlayerTurn(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function deriveWinner(board, player) {
  let winner;
  for (const wining of WINNING_COMBINATIONS) {
    const firstSymbol = board[wining[0].row][wining[0].cell];
    const secondSymbol = board[wining[1].row][wining[1].cell];
    const thirdSymbol = board[wining[2].row][wining[2].cell];

    if (firstSymbol && firstSymbol === secondSymbol && firstSymbol === thirdSymbol) {
      winner = player[firstSymbol];
    }    
  }

  return winner
}

function App() {
  const [player, setPlayer] = useState({
    'X': 'Player 1',
    'O': 'Player 2',
  });
  const [gameTurns, setGameTurns] = useState([]);

  const currentPlayer = getPlayerTurn(gameTurns);

  let board = [...initialBoard.map(array => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, cell } = square;

    board[row][cell] = player;
  }

  const winner = deriveWinner(board, player)
  const draw = gameTurns.length === 9 && !winner

  winner && announceWinner(`${winner}, Wins! Congratulations.`)
  draw && announceWinner(`It's a Draw, Play Again!`)

  winner && setTimeout(() => {
    winner && winSound.play();
  }, 1300)


  const handleSwitchPlayer = (rowIndex, cellIndex) => {
    clickSound.play()
    setGameTurns((prev) => {
      const currentPlayer = getPlayerTurn(prev);
      const updatedTurns = [
        { square: { row: rowIndex, cell: cellIndex }, player: currentPlayer },
        ...prev,
      ];

      return updatedTurns;
    });
  };

  const handleReplay = () => {
    setGameTurns([])
  }

  const handlePlayerNameChange = (symbol, newName) => {
    setPlayer(prev => {
      return {
        ...prev,
        [symbol]: newName,
      }
    })
  }

  return (
    <main>
      {winner && <Confetti />}
      <div id="game-container">
        <ol id="players" className="highlight-player ">
          <Player name="player 1" symbol="X" isActive={currentPlayer === "X"} onChangeName={handlePlayerNameChange}/>
          <Player name="player 2" symbol="O" isActive={currentPlayer === "O"} onChangeName={handlePlayerNameChange}/>
        </ol>
        {(winner || draw) && <GameOver winner={winner} reset={handleReplay} />}
        <GameBoard onSelected={handleSwitchPlayer} board={board} />
      </div>
      <Log turns={gameTurns} winner={winner} />
    </main>
  );
}

export default App;
