import React, { useState } from "react";

function Player({ name, symbol, isActive, onChangeName }) {
  const [playerName, setPlayerName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const handleIsEditing = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
        onChangeName(symbol, playerName);
    }
  };

  const handleInputChange = (event) => {
    setPlayerName(event.target.value)
  }

  return (
    <li className={isActive ? 'active' : ''}>
      <span className="player">
        {!isEditing && <span className="player-name">{playerName}</span>}
        {isEditing && <input type="text" required value={playerName}  onChange={handleInputChange}/>}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleIsEditing}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}

export default Player;
