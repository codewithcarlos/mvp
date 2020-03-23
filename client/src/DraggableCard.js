import React from "react";
import Draggable from "react-draggable";

class DraggableCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDrags: 0,
      deltaPosition: {
        x: 0,
        y: 0
      },
      isRotated: false,
      counter: 0
    };
    this.handleDrag = this.handleDrag.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.rotate = this.rotate.bind(this);
  }

  handleDrag(e, ui) {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY
      }
    });
  }

  onStart(e) {
    console.log("onstart");
    let newCounter = this.props.indexCounter + 1;
    this.props.setIndexCounter(newCounter);
    this.setState({
      counter: newCounter
      // activeDrags: this.state.activeDrags + 1
    });
  }

  onStop() {
    // this.setState({ activeDrags: this.state.activeDrags - 1 });
  }

  rotate() {
    let isRotated = !this.state.isRotated;
    this.setState({ isRotated });
  }

  render() {
    // console.log("draggable card rerendered");
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    // const { deltaPosition } = this.state;
    // console.log("deltaPosition", deltaPosition);

    const { card, i, coordinates } = this.props;
    const { x, y } = coordinates[card.cardID];

    return (
      <Draggable bounds="parent" onDrag={this.handleDrag} {...dragHandlers}>
        <div
          className="card-image-container"
          style={{
            zIndex: this.state.counter,
            left: x,
            top: y,
            position: "absolute"
          }}
        >
          <img
            src={card.imageUrl}
            alt={card.name}
            className={
              this.state.isRotated ? "card-image rotated" : "card-image"
            }
            onDoubleClick={this.rotate}
            id={i}
          />
        </div>
      </Draggable>
    );
  }
}

export default DraggableCard;
