import React from "react";
import { observer } from "mobx-react-lite";

const Gallery = () => {
  return (
    <div className="container-flex">
      <div className="gallery"></div>
      <div className="gallery"></div>
      <div className="gallery"></div>
    </div>
  );
};

export default observer(Gallery);
