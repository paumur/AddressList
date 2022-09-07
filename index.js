let data = [];
let checkedList = [];

window.onload = () => {
  if (localStorage.length) {
    renderContactsFromLocalStorate();
    data = retrieveDataFromLocalStorage();
    Draggable();
  }
};

document
  .querySelector(".user-registration__form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    data.push(Object.fromEntries(formData));
    data.forEach((contact) => {
      contact.favorite = false;
    });
    syncToLocalStorage();
    renderContactsFromLocalStorate();
  });

function syncToLocalStorage() {
  localStorage.setItem("data", JSON.stringify(data));
}

function retrieveDataFromLocalStorage() {
  let localStoredData = JSON.parse(localStorage.data);
  return localStoredData;
}

function renderContactsFromLocalStorate() {
  if (localStorage.length) {
    const renderedData = retrieveDataFromLocalStorage();
    const cardRoot = document.querySelector(".users-list");
    while (cardRoot.firstChild) {
      cardRoot.removeChild(cardRoot.lastChild);
    }
    renderedData.forEach((contact) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "card-wrapper";
      const card = document.createElement("div");
      card.className = "card";
      cardWrapper.appendChild(card);
      const cardName = document.createElement("div");
      cardName.textContent = contact.name;
      cardName.className = "card__name";
      const cardPhone = document.createElement("div");
      cardPhone.textContent = contact.tel;
      cardPhone.className = "card__phone";
      const cardEmail = document.createElement("div");
      cardEmail.textContent = contact.email;
      cardEmail.className = "card__email";
      card.appendChild(cardName);
      card.appendChild(cardPhone);
      card.appendChild(cardEmail);
      const cardActions = document.createElement("div");
      cardActions.className = "card-actions";
      cardWrapper.appendChild(cardActions);
      const buttonFavorite = document.createElement("i");
      contact.favorite
        ? (buttonFavorite.className = "fa-solid fa-star")
        : (buttonFavorite.className = "fa-regular fa-star");
      const buttonEdit = document.createElement("i");
      buttonEdit.className = "fa-solid fa-pen-to-square";
      buttonEdit.style.color = "#ffd369";
      const buttonRemove = document.createElement("i");
      buttonRemove.className = "fa-solid fa-trash";
      const buttonCheck = document.createElement("i");
      buttonCheck.className = "fa-regular fa-square-check";
      buttonCheck.style.color = "#ffd369";
      cardActions.appendChild(buttonFavorite);
      cardActions.appendChild(buttonEdit);
      cardActions.appendChild(buttonRemove);
      cardActions.appendChild(buttonCheck);
      cardRoot.appendChild(cardWrapper);
    });
    const getWrapper = document.querySelectorAll(".card-wrapper");
    getWrapper.forEach((card) => {
      card.setAttribute("draggable", "true");
    });
  }
}

// Card button functionality

window.addEventListener("click", (e) => {
  // DELETE SELECTED CARD
  if (e.target.className.includes("fa-trash")) {
    const card = e.target.parentNode.parentNode;
    const cardName = card.querySelector(".card__name").textContent;
    const cardTel = card.querySelector(".card__phone").textContent;
    const cardEmail = card.querySelector(".card__email").textContent;
    removeDataFromLocalStorage(cardName, cardEmail, cardTel);
  }
  // MAKE SELECTED CARD FAVORITE
  if (e.target.className.includes("fa-star")) {
    if (e.target.className.includes("fa-regular")) {
      const card = e.target.parentNode.parentNode;
      const index = [...card.parentElement.children].indexOf(card);
      const favoriteCard = data.splice(index, 1);
      data.unshift(...favoriteCard);
      data[0].favorite = true;
      syncToLocalStorage();
      renderContactsFromLocalStorate();
    } else {
      const card = e.target.parentNode.parentNode;
      const index = [...card.parentElement.children].indexOf(card);
      const favoriteCard = data.splice(index, 1);
      data.push(...favoriteCard);
      data[data.length - 1].favorite = false;
      syncToLocalStorage();
      renderContactsFromLocalStorate();
      Draggable();
    }
  }
  // Make SELECTED CARD EDITABLE

  function makeInputsEditable(trueOrFalse) {
    const card = e.target.parentNode.parentNode;
    const index = [...card.parentElement.children].indexOf(card);
    const cardName = card.querySelector(".card__name");
    cardName.setAttribute("contenteditable", trueOrFalse);
    const cardTel = card.querySelector(".card__phone");
    cardTel.setAttribute("contenteditable", trueOrFalse);
    const cardEmail = card.querySelector(".card__email");
    cardEmail.setAttribute("contenteditable", trueOrFalse);
    return [cardName.textContent, cardEmail.textContent, cardTel.textContent];
  }

  if (e.target.className.includes("fa-pen-to-square")) {
    if (e.target.style.color === "rgb(255, 211, 105)") {
      e.target.style.color = "#42855B";
      makeInputsEditable(true);
    } else {
      e.target.style.color = "rgb(255, 211, 105)";
      const values = makeInputsEditable(false);
      const card = e.target.parentNode.parentNode;
      const index = [...card.parentElement.children].indexOf(card);
      data[index].name = values[0];
      data[index].email = values[1];
      data[index].tel = values[2];
      syncToLocalStorage();
      Draggable();
    }
  }

  // Make SELECTION OF CARDS REMOVED

  document
    .querySelector(".function-buttons__delete-selected")
    .addEventListener("click", () => {
      deleteSelectedCards(checkedList);
    });

  function deleteSelectedCards(indexArray) {
    data = data.filter((val, i) => {
      return indexArray.indexOf(i) == -1;
    });
    checkedList = [];
    syncToLocalStorage();
    renderContactsFromLocalStorate();
    Draggable();
  }

  if (e.target.className.includes("fa-square-check")) {
    if (e.target.style.color === "rgb(255, 211, 105)") {
      e.target.style.color = "#42855B";
      const card = e.target.parentNode.parentNode;
      const index = [...card.parentElement.children].indexOf(card);
      e.target.className = "fa-solid fa-square-check";
      checkedList.push(index);
    } else {
      e.target.style.color = "rgb(255, 211, 105)";
      const card = e.target.parentNode.parentNode;
      const index = [...card.parentElement.children].indexOf(card);
      checkedList.splice(index, 1);
      e.target.className = "fa-regular fa-square-check";
    }
  }
});

// Enable ALL Cards Edit

document
  .querySelector(".function-buttons__edit-multiple")
  .addEventListener("click", (e) => {
    e.target.classList.toggle("function-buttons__edit-multiple--selected");
    document.querySelectorAll(".card-wrapper").forEach((item) => {
      item.classList.toggle("card-wrapper--selected");
    });
    const cards = document.querySelectorAll(".card-wrapper");
    cards.forEach((card) => {
      if (!card.getAttribute("contenteditable")) {
        card.setAttribute("contenteditable", true);
      } else {
        card.setAttribute("contenteditable", false);
        const cardName = document.querySelectorAll(".card__name");
        const cardTel = document.querySelectorAll(".card__phone");
        const cardEmail = document.querySelectorAll(".card__email");
        for (i = 0; i < data.length; i++) {
          data[i].name = cardName[i].textContent;
          data[i].tel = cardTel[i].textContent;
          data[i].email = cardEmail[i].textContent;
        }
        syncToLocalStorage();
        renderContactsFromLocalStorate();
        Draggable();
      }
    });
  });

// SORT CONTACTS BY NAME A-Z

document
  .querySelector(".function-buttons__sord-a-z")
  .addEventListener("click", () => {
    data.sort((a, b) => {
      if (a.favorite) {
        return -1;
      } else if (a.favorite) {
        return -1;
      } else {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      }
    });
    syncToLocalStorage();
    renderContactsFromLocalStorate();
    Draggable();
  });

// SEARCH FOR DESIRE CONTACT

const searchBar = document.querySelector(".function-buttons__search-contact");
searchBar.addEventListener("keyup", (e) => {
  let searchString = e.target.value;
  const filteredData = data.filter((contact) => {
    return (
      contact.name.includes(searchString) ||
      contact.email.includes(searchString) ||
      contact.tel.includes(searchString)
    );
  });
  renderContactsFromData(filteredData);
});

function renderContactsFromData(data) {
  const cardRoot = document.querySelector(".users-list");
  while (cardRoot.firstChild) {
    cardRoot.removeChild(cardRoot.lastChild);
  }
  data.forEach((contact) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "card-wrapper";
    const card = document.createElement("div");
    card.className = "card";
    cardWrapper.appendChild(card);
    const cardName = document.createElement("div");
    cardName.textContent = contact.name;
    cardName.className = "card__name";
    const cardPhone = document.createElement("div");
    cardPhone.textContent = contact.tel;
    cardPhone.className = "card__phone";
    const cardEmail = document.createElement("div");
    cardEmail.textContent = contact.email;
    cardEmail.className = "card__email";
    card.appendChild(cardName);
    card.appendChild(cardPhone);
    card.appendChild(cardEmail);
    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";
    cardWrapper.appendChild(cardActions);
    const buttonFavorite = document.createElement("i");
    contact.favorite
      ? (buttonFavorite.className = "fa-solid fa-star")
      : (buttonFavorite.className = "fa-regular fa-star");
    const buttonEdit = document.createElement("i");
    buttonEdit.className = "fa-solid fa-pen-to-square";
    buttonEdit.style.color = "#ffd369";
    const buttonRemove = document.createElement("i");
    buttonRemove.className = "fa-solid fa-trash";
    const buttonCheck = document.createElement("i");
    buttonCheck.className = "fa-regular fa-square-check";
    buttonCheck.style.color = "#ffd369";
    cardActions.appendChild(buttonFavorite);
    cardActions.appendChild(buttonEdit);
    cardActions.appendChild(buttonRemove);
    cardActions.appendChild(buttonCheck);
    cardRoot.appendChild(cardWrapper);
  });
  const getWrapper = document.querySelectorAll(".card-wrapper");
  getWrapper.forEach((card) => {
    card.setAttribute("draggable", "true");
  });
  Draggable();
}

function removeDataFromLocalStorage(cardName, cardEmail, cardTel) {
  try {
    data.forEach((contact, i) => {
      if (Object.values(contact).includes(cardName, cardEmail, cardTel)) {
        data.splice(i, 1);
        syncToLocalStorage();
        renderContactsFromLocalStorate();
        throw "Break";
      }
    });
  } catch (e) {
    if (e !== "Break") throw e;
  }
}

// Draggable functionallity

function Draggable() {
  const cards = document.querySelectorAll(".card-wrapper");
  let startIndex;
  let endIndex;
  cards.forEach((card, i) => {
    card.addEventListener("dragstart", () => {
      startIndex = i;
    });
  });
  cards.forEach((card, i) => {
    card.addEventListener("dragend", () => {
      [data[startIndex], data[endIndex]] = [data[endIndex], data[startIndex]];
      renderContactsFromData(data);
      syncToLocalStorage();
    });
  });

  cards.forEach((card, i) => {
    card.addEventListener("dragover", () => {
      endIndex = i;
    });
  });
}
