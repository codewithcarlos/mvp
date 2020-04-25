import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";

const Search = ({ zone, zoneId, handleDropdownSelection }) => {
  const [term, setTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [list, setList] = useState([]);
  // console.log("Search rerendered", zoneId);

  useEffect(() => {
    if (!zone.length && !list.length) return;
    const newList = [];

    zone.map((card) =>
      newList.push({ key: card.cardID, value: card.cardID, text: card.name })
    );

    newList.sort((a, b) => {
      if (a.text < b.text) return -1;
      if (a.text > b.text) return 1;
      return 0;
    });
    setList(newList);
  }, [zone]);

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
          type="text"
          value={term}
          placeholder={"Search " + zoneId}
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
                  data-id={`${zoneId}-${card.value}`}
                >
                  <div className="text" data-id={`${zoneId}-${card.value}`}>
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

export default observer(Search);
