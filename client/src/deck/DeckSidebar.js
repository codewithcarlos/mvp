import React from 'react'
import Tools from "./Tools";
import Vendors from "./Vendors";
import { observer } from "mobx-react-lite";

const DeckSidebar = () => {
  return (
    <div className="deck-sidebar-container">
      <Vendors />
      <Tools />
    </div>
  )
}

export default observer(DeckSidebar)
