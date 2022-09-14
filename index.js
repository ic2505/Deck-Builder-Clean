const searchBar = document.getElementById("search-bar");
const searchDeck = document.getElementById("search-deck");
const playerDeck = document.getElementById("player-deck");

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
    // console.log(cardHTML);
    // console.log(cardData);
    addCardToPlayerDeck(cardHTML);
  });
  searchDeck.append(cardHTML);
};

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
function addCardToPlayerDeck(cardHTML) {
  // console.log(cardHTML);
  let playerCard = cardHTML.cloneNode(true);
  let newId = extractIdFromClass(cardHTML.className).replace("s", "p");
  playerCard.className = `card ${newId} player-deck-card`;
  if (
    document.getElementsByClassName(newId).length < 3 &&
    document.getElementsByClassName("player-deck-card").length <= 60
  ) {
    playerCard.addEventListener("click", () => {
      console.log(playerCard)
      playerCard.remove();
    })
    playerDeck.appendChild(playerCard);
  } else {
    console.log(`card ${newId} already exists 3 times in deck`);
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

document.querySelector("#cards-search").addEventListener("submit", (event) => {
  event.preventDefault();
  clearList(searchDeck);
  fetchCards(event.target.querySelector("#search-bar").value);
  document.querySelector("#cards-search").reset();
});
