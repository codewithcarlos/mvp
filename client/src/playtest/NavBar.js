import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { observer } from 'mobx-react-lite';

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (e, data) => {
    console.log(data.name);
    setActiveItem(data.name);
  };
  return (
    <Menu inverted>
      <Menu.Item
        name="Decks"
        active={activeItem === "Decks"}
        onClick={(e, data) => handleItemClick(e, data)}
      />
      <Menu.Item
        name="Articles"
        active={activeItem === "Articles"}
        onClick={(e, data) => handleItemClick(e, data)}
      />
      <Menu.Item
        name="Login"
        active={activeItem === "Login"}
        onClick={(e, data) => handleItemClick(e, data)}
        position="right"
      />
    </Menu>
  );
};

export default observer(NavBar);
