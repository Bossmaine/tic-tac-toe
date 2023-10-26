import React from 'react'

export default function GameOver({winner, reset}) {
  return (
    <div id='game-over'>
      <h2>Game Over</h2>
      {winner && <p>{winner} Wins!</p>}
      {!winner && <p>It's a draw</p>}
      <p><button onClick={reset}>Play Again!</button></p>
    </div>
  )
}
