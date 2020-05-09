const { db } = require("../db/index");

const setNames = [
  {
    text: "10th Edition",
    value: "10th Edition",
  },
  {
    text: "7th Edition",
    value: "7th Edition",
  },
  {
    text: "8th Edition",
    value: "8th Edition",
  },
  {
    text: "9th Edition",
    value: "9th Edition",
  },
  {
    text: "Aether Revolt",
    value: "Aether Revolt",
  },
  {
    text: "Alara Reborn",
    value: "Alara Reborn",
  },
  {
    text: "Alliances",
    value: "Alliances",
  },
  {
    text: "Alpha Edition",
    value: "Alpha Edition",
  },
  {
    text: "Amonkhet",
    value: "Amonkhet",
  },
  {
    text: "Anthologies",
    value: "Anthologies",
  },
  {
    text: "Antiquities",
    value: "Antiquities",
  },
  {
    text: "APAC Lands",
    value: "APAC Lands",
  },
  {
    text: "Apocalypse",
    value: "Apocalypse",
  },
  {
    text: "Arabian Nights",
    value: "Arabian Nights",
  },
  {
    text: "Archenemy",
    value: "Archenemy",
  },
  {
    text: "Archenemy: Nicol Bolas",
    value: "Archenemy: Nicol Bolas",
  },
  {
    text: "Arena Promos",
    value: "Arena Promos",
  },
  {
    text: "Art Series: Modern Horizons",
    value: "Art Series: Modern Horizons",
  },
  {
    text: "Astral",
    value: "Astral",
  },
  {
    text: "Avacyn Restored",
    value: "Avacyn Restored",
  },
  {
    text: "Battle for Zendikar",
    value: "Battle for Zendikar",
  },
  {
    text: "Battle Royale Box Set",
    value: "Battle Royale Box Set",
  },
  {
    text: "Battlebond",
    value: "Battlebond",
  },
  {
    text: "Beatdown Box Set",
    value: "Beatdown Box Set",
  },
  {
    text: "Beta Edition",
    value: "Beta Edition",
  },
  {
    text: "Betrayers of Kamigawa",
    value: "Betrayers of Kamigawa",
  },
  {
    text: "Born of the Gods",
    value: "Born of the Gods",
  },
  {
    text: "Box Sets",
    value: "Box Sets",
  },
  {
    text: "Buy-A-Box Promos",
    value: "Buy-A-Box Promos",
  },
  {
    text: "Challenger Decks",
    value: "Challenger Decks",
  },
  {
    text: "Champions of Kamigawa",
    value: "Champions of Kamigawa",
  },
  {
    text: "Champs Promos",
    value: "Champs Promos",
  },
  {
    text: "Chronicles",
    value: "Chronicles",
  },
  {
    text: "Classic Sixth Edition",
    value: "Classic Sixth Edition",
  },
  {
    text: "Coldsnap",
    value: "Coldsnap",
  },
  {
    text: "Coldsnap Theme Deck Reprints",
    value: "Coldsnap Theme Deck Reprints",
  },
  {
    text: "Collector's Edition",
    value: "Collector's Edition",
  },
  {
    text: "Commander",
    value: "Commander",
  },
  {
    text: "Commander 2013",
    value: "Commander 2013",
  },
  {
    text: "Commander 2014",
    value: "Commander 2014",
  },
  {
    text: "Commander 2015",
    value: "Commander 2015",
  },
  {
    text: "Commander 2016",
    value: "Commander 2016",
  },
  {
    text: "Commander 2017",
    value: "Commander 2017",
  },
  {
    text: "Commander 2018",
    value: "Commander 2018",
  },
  {
    text: "Commander 2019",
    value: "Commander 2019",
  },
  {
    text: "Commander 2020",
    value: "Commander 2020",
  },
  {
    text: "Commander Anthology",
    value: "Commander Anthology",
  },
  {
    text: "Commander Anthology Volume II",
    value: "Commander Anthology Volume II",
  },
  {
    text: "Commander's Arsenal",
    value: "Commander's Arsenal",
  },
  {
    text: "Conflux",
    value: "Conflux",
  },
  {
    text: "Conspiracy",
    value: "Conspiracy",
  },
  {
    text: "Conspiracy: Take the Crown",
    value: "Conspiracy: Take the Crown",
  },
  {
    text: "Core Set 2019",
    value: "Core Set 2019",
  },
  {
    text: "Core Set 2020",
    value: "Core Set 2020",
  },
  {
    text: "Dark Ascension",
    value: "Dark Ascension",
  },
  {
    text: "Darksteel",
    value: "Darksteel",
  },
  {
    text: "Deckmasters Garfield vs Finkel",
    value: "Deckmasters Garfield vs Finkel",
  },
  {
    text: "Dissension",
    value: "Dissension",
  },
  {
    text: "Dominaria",
    value: "Dominaria",
  },
  {
    text: "Dragon's Maze",
    value: "Dragon's Maze",
  },
  {
    text: "Dragons of Tarkir",
    value: "Dragons of Tarkir",
  },
  {
    text: "Duel Decks",
    value: "Duel Decks",
  },
  {
    text: "Duel Decks: Ajani vs. Nicol Bolas",
    value: "Duel Decks: Ajani vs. Nicol Bolas",
  },
  {
    text: "Duel Decks: Anthology",
    value: "Duel Decks: Anthology",
  },
  {
    text: "Duel Decks: Blessed vs. Cursed",
    value: "Duel Decks: Blessed vs. Cursed",
  },
  {
    text: "Duel Decks: Divine vs. Demonic",
    value: "Duel Decks: Divine vs. Demonic",
  },
  {
    text: "Duel Decks: Elspeth vs. Kiora",
    value: "Duel Decks: Elspeth vs. Kiora",
  },
  {
    text: "Duel Decks: Elspeth vs. Tezzeret",
    value: "Duel Decks: Elspeth vs. Tezzeret",
  },
  {
    text: "Duel Decks: Elves vs. Goblins",
    value: "Duel Decks: Elves vs. Goblins",
  },
  {
    text: "Duel Decks: Elves vs. Inventors",
    value: "Duel Decks: Elves vs. Inventors",
  },
  {
    text: "Duel Decks: Garruk vs. Liliana",
    value: "Duel Decks: Garruk vs. Liliana",
  },
  {
    text: "Duel Decks: Heroes vs. Monsters",
    value: "Duel Decks: Heroes vs. Monsters",
  },
  {
    text: "Duel Decks: Izzet vs. Golgari",
    value: "Duel Decks: Izzet vs. Golgari",
  },
  {
    text: "Duel Decks: Jace vs. Chandra",
    value: "Duel Decks: Jace vs. Chandra",
  },
  {
    text: "Duel Decks: Jace vs. Vraska",
    value: "Duel Decks: Jace vs. Vraska",
  },
  {
    text: "Duel Decks: Knights vs. Dragons",
    value: "Duel Decks: Knights vs. Dragons",
  },
  {
    text: "Duel Decks: Merfolk vs. Goblins",
    value: "Duel Decks: Merfolk vs. Goblins",
  },
  {
    text: "Duel Decks: Mind vs. Might",
    value: "Duel Decks: Mind vs. Might",
  },
  {
    text: "Duel Decks: Nissa vs. Ob Nixilis",
    value: "Duel Decks: Nissa vs. Ob Nixilis",
  },
  {
    text: "Duel Decks: Phyrexia vs. the Coalition",
    value: "Duel Decks: Phyrexia vs. the Coalition",
  },
  {
    text: "Duel Decks: Sorin vs. Tibalt",
    value: "Duel Decks: Sorin vs. Tibalt",
  },
  {
    text: "Duel Decks: Speed vs. Cunning",
    value: "Duel Decks: Speed vs. Cunning",
  },
  {
    text: "Duel Decks: Venser vs. Koth",
    value: "Duel Decks: Venser vs. Koth",
  },
  {
    text: "Duel Decks: Zendikar vs. Eldrazi",
    value: "Duel Decks: Zendikar vs. Eldrazi",
  },
  {
    text: "Duels of the Planeswalkers",
    value: "Duels of the Planeswalkers",
  },
  {
    text: "Eldritch Moon",
    value: "Eldritch Moon",
  },
  {
    text: "Eternal Masters",
    value: "Eternal Masters",
  },
  {
    text: "European Lands",
    value: "European Lands",
  },
  {
    text: "Eventide",
    value: "Eventide",
  },
  {
    text: "Exodus",
    value: "Exodus",
  },
  {
    text: "Explorers of Ixalan",
    value: "Explorers of Ixalan",
  },
  {
    text: "Fallen Empires",
    value: "Fallen Empires",
  },
  {
    text: "Fate Reforged",
    value: "Fate Reforged",
  },
  {
    text: "Fifth Dawn",
    value: "Fifth Dawn",
  },
  {
    text: "Fifth Edition",
    value: "Fifth Edition",
  },
  {
    text: "FNM Promos",
    value: "FNM Promos",
  },
  {
    text: "Fourth Edition",
    value: "Fourth Edition",
  },
  {
    text: "Fourth Edition (Foreign Black Border)",
    value: "Fourth Edition (Foreign Black Border)",
  },
  {
    text: "Fourth Edition (Foreign White Border)",
    value: "Fourth Edition (Foreign White Border)",
  },
  {
    text: "From the Vault: Angels",
    value: "From the Vault: Angels",
  },
  {
    text: "From the Vault: Annihilation",
    value: "From the Vault: Annihilation",
  },
  {
    text: "From the Vault: Dragons",
    value: "From the Vault: Dragons",
  },
  {
    text: "From the Vault: Exiled",
    value: "From the Vault: Exiled",
  },
  {
    text: "From the Vault: Legends",
    value: "From the Vault: Legends",
  },
  {
    text: "From the Vault: Lore",
    value: "From the Vault: Lore",
  },
  {
    text: "From the Vault: Realms",
    value: "From the Vault: Realms",
  },
  {
    text: "From the Vault: Relics",
    value: "From the Vault: Relics",
  },
  {
    text: "From the Vault: Transform",
    value: "From the Vault: Transform",
  },
  {
    text: "From the Vault: Twenty",
    value: "From the Vault: Twenty",
  },
  {
    text: "Future Sight",
    value: "Future Sight",
  },
  {
    text: "Game Day & Store Championship Promos",
    value: "Game Day & Store Championship Promos",
  },
  {
    text: "Gatecrash",
    value: "Gatecrash",
  },
  {
    text: "Gift Boxes and Promos",
    value: "Gift Boxes and Promos",
  },
  {
    text: "Global Series Jiang Yanggu & Mu Yanling",
    value: "Global Series Jiang Yanggu & Mu Yanling",
  },
  {
    text: "Grand Prix Promos",
    value: "Grand Prix Promos",
  },
  {
    text: "Guildpact",
    value: "Guildpact",
  },
  {
    text: "Guilds of Ravnica",
    value: "Guilds of Ravnica",
  },
  {
    text: "Guilds of Ravnica: Guild Kits",
    value: "Guilds of Ravnica: Guild Kits",
  },
  {
    text: "Guru Lands",
    value: "Guru Lands",
  },
  {
    text: "Hero's Path Promos",
    value: "Hero's Path Promos",
  },
  {
    text: "Homelands",
    value: "Homelands",
  },
  {
    text: "Hour of Devastation",
    value: "Hour of Devastation",
  },
  {
    text: "Ice Age",
    value: "Ice Age",
  },
  {
    text: "Iconic Masters",
    value: "Iconic Masters",
  },
  {
    text: "Ikoria: Lair of Behemoths",
    value: "Ikoria: Lair of Behemoths",
  },
  {
    text: "Innistrad",
    value: "Innistrad",
  },
  {
    text: "International Edition",
    value: "International Edition",
  },
  {
    text: "Invasion",
    value: "Invasion",
  },
  {
    text: "Ixalan",
    value: "Ixalan",
  },
  {
    text: "JingHe Age Token Cards",
    value: "JingHe Age Token Cards",
  },
  {
    text: "Journey Into Nyx",
    value: "Journey Into Nyx",
  },
  {
    text: "Judge Promos",
    value: "Judge Promos",
  },
  {
    text: "Judgment",
    value: "Judgment",
  },
  {
    text: "Junior Series Promos",
    value: "Junior Series Promos",
  },
  {
    text: "Kaladesh",
    value: "Kaladesh",
  },
  {
    text: "Khans of Tarkir",
    value: "Khans of Tarkir",
  },
  {
    text: "Launch Party & Release Event Promos",
    value: "Launch Party & Release Event Promos",
  },
  {
    text: "League Promos",
    value: "League Promos",
  },
  {
    text: "Legends",
    value: "Legends",
  },
  {
    text: "Legions",
    value: "Legions",
  },
  {
    text: "Lorwyn",
    value: "Lorwyn",
  },
  {
    text: "Magic 2010 (M10)",
    value: "Magic 2010 (M10)",
  },
  {
    text: "Magic 2011 (M11)",
    value: "Magic 2011 (M11)",
  },
  {
    text: "Magic 2012 (M12)",
    value: "Magic 2012 (M12)",
  },
  {
    text: "Magic 2013 (M13)",
    value: "Magic 2013 (M13)",
  },
  {
    text: "Magic 2014 (M14)",
    value: "Magic 2014 (M14)",
  },
  {
    text: "Magic 2015 (M15)",
    value: "Magic 2015 (M15)",
  },
  {
    text: "Magic Game Night",
    value: "Magic Game Night",
  },
  {
    text: "Magic Game Night 2019",
    value: "Magic Game Night 2019",
  },
  {
    text: "Magic Modern Event Deck",
    value: "Magic Modern Event Deck",
  },
  {
    text: "Magic Origins",
    value: "Magic Origins",
  },
  {
    text: "Magic Player Rewards",
    value: "Magic Player Rewards",
  },
  {
    text: "Magic Premiere Shop",
    value: "Magic Premiere Shop",
  },
  {
    text: "MagicFest Cards",
    value: "MagicFest Cards",
  },
  {
    text: "Masterpiece Series: Amonkhet Invocations",
    value: "Masterpiece Series: Amonkhet Invocations",
  },
  {
    text: "Masterpiece Series: Kaladesh Inventions",
    value: "Masterpiece Series: Kaladesh Inventions",
  },
  {
    text: "Masters 25",
    value: "Masters 25",
  },
  {
    text: "Media Promos",
    value: "Media Promos",
  },
  {
    text: "Mercadian Masques",
    value: "Mercadian Masques",
  },
  {
    text: "Mirage",
    value: "Mirage",
  },
  {
    text: "Mirrodin",
    value: "Mirrodin",
  },
  {
    text: "Mirrodin Besieged",
    value: "Mirrodin Besieged",
  },
  {
    text: "Modern Horizons",
    value: "Modern Horizons",
  },
  {
    text: "Modern Masters",
    value: "Modern Masters",
  },
  {
    text: "Modern Masters 2015",
    value: "Modern Masters 2015",
  },
  {
    text: "Modern Masters 2017",
    value: "Modern Masters 2017",
  },
  {
    text: "Morningtide",
    value: "Morningtide",
  },
  {
    text: "Mystery Booster Cards",
    value: "Mystery Booster Cards",
  },
  {
    text: "Mystery Booster: Convention Edition Exclusives",
    value: "Mystery Booster: Convention Edition Exclusives",
  },
  {
    text: "Mystery Booster: Retail Exclusives",
    value: "Mystery Booster: Retail Exclusives",
  },
  {
    text: "Mythic Edition: Guilds of Ravnica",
    value: "Mythic Edition: Guilds of Ravnica",
  },
  {
    text: "Mythic Edition: Ravnica Allegiance",
    value: "Mythic Edition: Ravnica Allegiance",
  },
  {
    text: "Mythic Edition: War of the Spark",
    value: "Mythic Edition: War of the Spark",
  },
  {
    text: "Nemesis",
    value: "Nemesis",
  },
  {
    text: "New Phyrexia",
    value: "New Phyrexia",
  },
  {
    text: "Oath of the Gatewatch",
    value: "Oath of the Gatewatch",
  },
  {
    text: "Odyssey",
    value: "Odyssey",
  },
  {
    text: "Onslaught",
    value: "Onslaught",
  },
  {
    text: "Open House Promos",
    value: "Open House Promos",
  },
  {
    text: "Oversize Cards",
    value: "Oversize Cards",
  },
  {
    text: "Planar Chaos",
    value: "Planar Chaos",
  },
  {
    text: "Planechase",
    value: "Planechase",
  },
  {
    text: "Planechase 2012",
    value: "Planechase 2012",
  },
  {
    text: "Planechase Anthology",
    value: "Planechase Anthology",
  },
  {
    text: "Planeshift",
    value: "Planeshift",
  },
  {
    text: "Planeswalker Event Promos",
    value: "Planeswalker Event Promos",
  },
  {
    text: "Ponies: The Galloping",
    value: "Ponies: The Galloping",
  },
  {
    text: "Portal",
    value: "Portal",
  },
  {
    text: "Portal Second Age",
    value: "Portal Second Age",
  },
  {
    text: "Portal Three Kingdoms",
    value: "Portal Three Kingdoms",
  },
  {
    text: "Premium Deck Series: Fire and Lightning",
    value: "Premium Deck Series: Fire and Lightning",
  },
  {
    text: "Premium Deck Series: Graveborn",
    value: "Premium Deck Series: Graveborn",
  },
  {
    text: "Premium Deck Series: Slivers",
    value: "Premium Deck Series: Slivers",
  },
  {
    text: "Prerelease Cards",
    value: "Prerelease Cards",
  },
  {
    text: "Pro Tour Promos",
    value: "Pro Tour Promos",
  },
  {
    text: "Promo Pack: Core Set 2020",
    value: "Promo Pack: Core Set 2020",
  },
  {
    text: "Promo Pack: Ikoria",
    value: "Promo Pack: Ikoria",
  },
  {
    text: "Promo Pack: Theros Beyond Death",
    value: "Promo Pack: Theros Beyond Death",
  },
  {
    text: "Promo Pack: Throne of Eldraine",
    value: "Promo Pack: Throne of Eldraine",
  },
  {
    text: "Prophecy",
    value: "Prophecy",
  },
  {
    text: "Ravnica Allegiance",
    value: "Ravnica Allegiance",
  },
  {
    text: "Ravnica Allegiance: Guild Kits",
    value: "Ravnica Allegiance: Guild Kits",
  },
  {
    text: "Ravnica: City of Guilds",
    value: "Ravnica: City of Guilds",
  },
  {
    text: "Renaissance",
    value: "Renaissance",
  },
  {
    text: "Return to Ravnica",
    value: "Return to Ravnica",
  },
  {
    text: "Revised Edition",
    value: "Revised Edition",
  },
  {
    text: "Revised Edition (Foreign Black Border)",
    value: "Revised Edition (Foreign Black Border)",
  },
  {
    text: "Revised Edition (Foreign White Border)",
    value: "Revised Edition (Foreign White Border)",
  },
  {
    text: "Rise of the Eldrazi",
    value: "Rise of the Eldrazi",
  },
  {
    text: "Rivals of Ixalan",
    value: "Rivals of Ixalan",
  },
  {
    text: "Saviors of Kamigawa",
    value: "Saviors of Kamigawa",
  },
  {
    text: "Scars of Mirrodin",
    value: "Scars of Mirrodin",
  },
  {
    text: "Scourge",
    value: "Scourge",
  },
  {
    text: "Secret Lair Drop Series",
    value: "Secret Lair Drop Series",
  },
  {
    text: "Secret Lair Series",
    value: "Secret Lair Series",
  },
  {
    text: "Shadowmoor",
    value: "Shadowmoor",
  },
  {
    text: "Shadows over Innistrad",
    value: "Shadows over Innistrad",
  },
  {
    text: "Shards of Alara",
    value: "Shards of Alara",
  },
  {
    text: "Signature Spellbook: Chandra",
    value: "Signature Spellbook: Chandra",
  },
  {
    text: "Signature Spellbook: Gideon",
    value: "Signature Spellbook: Gideon",
  },
  {
    text: "Signature Spellbook: Jace",
    value: "Signature Spellbook: Jace",
  },
  {
    text: "Special Occasion",
    value: "Special Occasion",
  },
  {
    text: "Spellslinger Starter Kit",
    value: "Spellslinger Starter Kit",
  },
  {
    text: "Standard Showdown Promos",
    value: "Standard Showdown Promos",
  },
  {
    text: "Starter 1999",
    value: "Starter 1999",
  },
  {
    text: "Starter 2000",
    value: "Starter 2000",
  },
  {
    text: "Stronghold",
    value: "Stronghold",
  },
  {
    text: "Summer Magic",
    value: "Summer Magic",
  },
  {
    text: "Tarkir Dragonfury Promos",
    value: "Tarkir Dragonfury Promos",
  },
  {
    text: "Tempest",
    value: "Tempest",
  },
  {
    text: "The Dark",
    value: "The Dark",
  },
  {
    text: "Theros",
    value: "Theros",
  },
  {
    text: "Theros Beyond Death",
    value: "Theros Beyond Death",
  },
  {
    text: "Throne of Eldraine",
    value: "Throne of Eldraine",
  },
  {
    text: "Time Spiral",
    value: "Time Spiral",
  },
  {
    text: "Timeshifted",
    value: "Timeshifted",
  },
  {
    text: "Torment",
    value: "Torment",
  },
  {
    text: "Ugin's Fate Promos",
    value: "Ugin's Fate Promos",
  },
  {
    text: "Ultimate Masters",
    value: "Ultimate Masters",
  },
  {
    text: "Ultimate Masters: Box Toppers",
    value: "Ultimate Masters: Box Toppers",
  },
  {
    text: "Unglued",
    value: "Unglued",
  },
  {
    text: "Unhinged",
    value: "Unhinged",
  },
  {
    text: "Unique and Miscellaneous Promos",
    value: "Unique and Miscellaneous Promos",
  },
  {
    text: "Unlimited Edition",
    value: "Unlimited Edition",
  },
  {
    text: "Unsanctioned",
    value: "Unsanctioned",
  },
  {
    text: "Unstable",
    value: "Unstable",
  },
  {
    text: "Urza's Destiny",
    value: "Urza's Destiny",
  },
  {
    text: "Urza's Legacy",
    value: "Urza's Legacy",
  },
  {
    text: "Urza's Saga",
    value: "Urza's Saga",
  },
  {
    text: "Vanguard",
    value: "Vanguard",
  },
  {
    text: "Visions",
    value: "Visions",
  },
  {
    text: "War of the Spark",
    value: "War of the Spark",
  },
  {
    text: "Weatherlight",
    value: "Weatherlight",
  },
  {
    text: "Welcome Deck 2016",
    value: "Welcome Deck 2016",
  },
  {
    text: "Welcome Deck 2017",
    value: "Welcome Deck 2017",
  },
  {
    text: "WMCQ Promo Cards",
    value: "WMCQ Promo Cards",
  },
  {
    text: "World Championship Decks",
    value: "World Championship Decks",
  },
  {
    text: "Worldwake",
    value: "Worldwake",
  },
  {
    text: "WPN & Gateway Promos",
    value: "WPN & Gateway Promos",
  },
  {
    text: "Zendikar",
    value: "Zendikar",
  },
  {
    text: "Zendikar Expeditions",
    value: "Zendikar Expeditions",
  },
];

let i = 0;
const populate = () => {
  const set = setNames[i].text;
  const queryString = `INSERT INTO tcg_set_names (tcg_setName) VALUES(?);`;
  console.log("qstr is:", queryString);
  db.query(queryString, set, (err, data) => {
    if (err) {
      console.log("err inserting set", set, i);
      throw err;
    }
    i++;
    console.log(i);
    if (i < setNames.length) {
      populate();
    } else {
      console.log("finished");
      return;
    }
  });
};
// populate();
console.log(setNames.length)