import React, { useState, useEffect } from "react";
// import { Dropdown } from "semantic-ui-react";

const SearchDeck = ({ deck, handleDropdownSelection }) => {
  const [term, setTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const newList = [];
    if (deck.length) {
      deck.map((card) =>
        newList.push({ key: card.cardID, value: card.cardID, text: card.name })
      );
    }
    newList.sort((a, b) => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });
    setList(newList);
  }, [deck]);

  const handleTermChange = (e) => {
    setTerm(e.target.value);
  };

  return (
    <div className="search">
      <div
        role="combobox"
        aria-expanded="false"
        className="ui fluid search selection dropdown"
        onClick={() => setShowDropdown(!showDropdown)}
        onBlur={() => setShowDropdown(false)}
      >
        <input
          aria-autocomplete="list"
          autoComplete="off"
          className="search"
          tabIndex="0"
          type="text"
          value={term}
          placeholder="Search library"
          onChange={handleTermChange}
        />
        <div
          className="default text"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
        ></div>
        <i aria-hidden="true" className="dropdown icon"></i>
        <div
          role="listbox"
          className={
            showDropdown ? "menu transition visible" : "menu transition"
          }
        >
          {list.length ? (
            list
              .filter((card) =>
                card.text.toLowerCase().includes(term.toLowerCase())
              )
              .map((card, i) => (
                <div
                  className="item"
                  key={i}
                  onMouseDown={(e) => {
                    handleDropdownSelection(e);
                    setTerm("");
                  }}
                  data-id={`tutor-${card.value}`}
                >
                  <div className="text" data-id={`tutor-${card.value}`}>
                    {card.text}
                  </div>
                </div>
              ))
          ) : (
            <div className="message">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDeck;
