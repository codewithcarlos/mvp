import React from "react";
import { Card, Icon, Image, Popup } from "semantic-ui-react";

const DeckCard = () => {
  // console.log("rerendered deck");
  return (
    <Card>
      <div className="flex-container">
        <Image
          src="https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=235597&type=card"
          wrapped
          ui={false}
        />
        <Card.Content>
          <div className="card-header">Jund</div>
          <Card.Meta>
            <div className="mana-colors">
              <img src={"./swamp.jpg"} alt="swamp" />
              <img src={"./mountain.jpg"} alt="mountain" />
              <img src={"./forest.jpg"} alt="forest" />
              {/* <img src={"./island.jpg"} alt="island" />
            <img src={"./plains.jpg"} alt="plains" /> */}
            </div>
          </Card.Meta>
          <Card.Description>
            <div>Liliana of the Veil</div>
            <div>Tarmogoyf</div>
            <div>Wrenn and Six</div>
          </Card.Description>
        </Card.Content>
      </div>
      <Card.Content extra>
        <Popup
          content="Number of Decks"
          trigger={
            <span className="hashtag-icon">
              <Icon name="hashtag" color="black" />
              <span>107</span>
            </span>
          }
          position="top center"
          size="tiny"
        />
        <Popup
          content="Percent of meta"
          trigger={
            <span>
              <Icon name="chart pie" color="black" />
              4.32%
            </span>
          }
          position="top center"
          size="tiny"
        />
        <Popup
          content="Price of deck"
          trigger={
            <span>
              <span className="dollar-icon">$</span>
              <span>1175</span>
            </span>
          }
          position="top center"
          size="tiny"
        />
      </Card.Content>
    </Card>
  );
};

export default DeckCard;
