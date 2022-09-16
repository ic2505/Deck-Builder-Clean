const searchBar = document.getElementById("search-bar");
const searchDeck = document.getElementById("search-deck");
const playerDeck = document.getElementById("player-deck");
const cardInfo = document.getElementById("card-info");

let selectDeck = "deck1";

const fetchCards = (name) => {
  // Fuzzy search
  return fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${name}`)
    .then((res) => res.json())
    .then((data) => {
      // cardData item contains all information on the card!
      data.data.forEach((cardData) => {
        renderSearchDeck(cardData);
      });
    });
};

// SEARCH DECK RENDER
const renderSearchDeck = (cardData) => {
  cardId = cardData.id;
  cardImageUrl = cardData.card_images[0].image_url_small;
  const cardHTML = createCardHTML("s", cardId, cardImageUrl);
  cardHTML.classList.add("search-deck-card");
  cardHTML.addEventListener("click", () => {
    addCardToPlayerDeck(cardData);
  });

  renderCardInfo(cardHTML, cardData);

  searchDeck.append(cardHTML);
};

function renderCardInfo(cardHTML, cardData) {
  cardHTML.querySelector("img").addEventListener("mouseover", () => {
    const cardInfoHTML = createCardHTML(
      "c",
      cardData.id,
      cardData.card_images[0].image_url
    );
    cardInfoHTML.querySelector("img").classList.add("card-info-image");
    const infoPopup = document.createElement("div");
    infoPopup.classList.add("card-info-popup");
    infoPopup.append(cardInfoHTML);
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("information-container");
    const descContainer = document.createElement("div");
    descContainer.classList.add("description-container");
    descContainer.textContent = cardData.desc;

    infoContainer.append(descContainer);
    infoPopup.append(infoContainer);
    cardInfo.append(infoPopup);
  });

  cardHTML.querySelector("img").addEventListener("mouseleave", () => {
    clearList(cardInfo);
  });
}

function createCardHTML(searchDeckOrPlayerDeck, id, url) {
  const card = document.createElement("a");
  const imageContainer = document.createElement("img");

  card.className = `card ${searchDeckOrPlayerDeck}${id}`;

  imageContainer.src = url;
  imageContainer.className = "card-image";
  card.append(imageContainer);
  return card;
}

// PLAYER DECK RENDER
function addCardToPlayerDeck(cardData) {
  const playerCardId = cardData.id;
  const playercardImageUrl = cardData.card_images[0].image_url_small;
  let playerCard = createCardHTML("p", playerCardId, playercardImageUrl);
  let newId = extractIdFromClass(playerCard.className);
  playerCard.classList.add("player-deck-card");
  if (
    document.getElementsByClassName(newId).length < 3 &&
    document.getElementsByClassName("player-deck-card").length < 60
  ) {
    playerCard.addEventListener("click", () => {
      playerCard.remove();
      // remove from database
    });
    playerDeck.appendChild(playerCard);
    renderCardInfo(playerCard, cardData);
    // add to database
  } else {
    console.log(`card ${newId} already exists 3 times in deck or deck is full`);
  }
}

function extractIdFromClass(classStr) {
  let str = classStr;
  let res = str.match(/[sp]\d{7,8}/g);
  return res[0];
}

// SEARCH CALL
const clearList = (parent) => {
  let first = parent.firstElementChild;
  while (first) {
    first.remove();
    first = parent.firstElementChild;
  }
};

document.querySelector(".searchbar").addEventListener("submit", (event) => {
  event.preventDefault();
  clearList(searchDeck);
  // console.log(event.target.querySelector(".search_input").value);
  if (event.target.querySelector(".search_input").value.length > 0) {
    fetchCards(event.target.querySelector(".search_input").value);
  }
  document.querySelector(".searchbar").reset();
});

const yugi = document.getElementById("yugi");
let counter = 1;
window.addEventListener("click", () => {
  if (counter > 3) {
    counter = 1;
  }
  yugi.src = `assets/yugi${counter}.png`;
  counter = counter + 1;
});

// add mouseover event to display information on card
