import React from 'react'
import DeckTable from "./DeckTable";
import { observer } from "mobx-react-lite";

const DeckTableView = () => {
  return (
    <div className="deck-table-view">
      {/* <Tabs /> */}
      <DeckTable 
      // library={library}
      />
    </div>
  )
}

export default observer(DeckTableView)
