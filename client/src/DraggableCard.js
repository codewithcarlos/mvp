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
      controlledPosition: {
        x: -400,
        y: 200
      },
      isRotated: false,
      counter: 0
    };
    this.handleDrag = this.handleDrag.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop = this.onStop.bind(this);
    this.adjustXPos = this.adjustXPos.bind(this);
    this.adjustYPos = this.adjustYPos.bind(this);
    this.onControlledDrag = this.onControlledDrag.bind(this);
    this.onControlledDragStop = this.onControlledDragStop.bind(this);
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
    console.log("onStart", e.target, this.state.counter);
    const el = e.target;
    let newCounter = this.props.indexCounter + 1;
    this.props.setIndexCounter(newCounter);
    this.setState({ counter: newCounter });
    this.setState({ activeDrags: ++this.state.activeDrags });
  }

  onStop() {
    console.log("remove");
    this.setState({ activeDrags: --this.state.activeDrags }, () =>
      console.log("active drags", this.state.activeDrags)
    );
  }

  // For controlled component
  adjustXPos(e) {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = this.state.controlledPosition;
    this.setState({ controlledPosition: { x: x - 10, y } });
  }

  adjustYPos(e) {
    e.preventDefault();
    e.stopPropagation();
    const { controlledPosition } = this.state;
    const { x, y } = controlledPosition;
    this.setState({ controlledPosition: { x, y: y - 10 } });
  }

  onControlledDrag(e, position) {
    const { x, y } = position;
    this.setState({ controlledPosition: { x, y } });
  }

  onControlledDragStop(e, position) {
    this.onControlledDrag(e, position);
    this.onStop();
  }
  rotate() {
    let isRotated = !this.state.isRotated;
    console.log("isrotated now", isRotated);
    this.setState({ isRotated });
  }

  render() {
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    // const { deltaPosition, controlledPosition } = this.state;
    const { card, indexCounter, setIndexCounter, i, onDragStart } = this.props;
    return (
      <div className="card" onDragStart={e => onDragStart(e)}>
        <Draggable {...dragHandlers}>
          <div
            className="card-image-container"
            style={{ zIndex: this.state.counter }}
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
      </div>
    );
  }
}

export default DraggableCard;
