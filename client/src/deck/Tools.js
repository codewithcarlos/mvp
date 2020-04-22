import React from 'react'
import { observer } from "mobx-react-lite";

const Tools = () => {
  return (
    <div className="commands">
      <button onClick={() => newGame()}>Buy from TCG Player</button>
      <button onClick={() => newGame()}>Playtest</button>
      <button onClick={() => newGame()}>Download</button>
      <button onClick={() => newGame()}>Edit Deck</button>
    </div>
  )
}

export default observer(Tools)
