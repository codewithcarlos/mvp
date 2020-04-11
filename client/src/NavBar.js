import React, { useState } from "react";
import { Menu } from "semantic-ui-react";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (e, { name }) => {
    let test = { name };
    console.log(test);
    setActiveItem(name);
  };
  return (
    <Menu inverted>
      <Menu.Item
        name="Decks"
        active={activeItem === "Decks"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="Articles"
        active={activeItem === "Articles"}
        onClick={handleItemClick}
      />
      <Menu.Item
        name="Login"
        active={activeItem === "Login"}
        onClick={handleItemClick}
        position="right"
      />
    </Menu>
  );
};

export default NavBar;
