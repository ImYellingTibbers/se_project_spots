const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const addCardButton = document.querySelector(".profile__add-button");

// Form elements
const editProfileModal = document.querySelector("#edit-modal");
const editProfileModalCloseButton = editProfileModal.querySelector(".modal__close-button");
const editForm = editProfileModal.querySelector(".modal__form");
const editProfileModalNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image")
const previewModalCaption = previewModal.querySelector(".modal__caption")
const previewModalCloseButton = previewModal.querySelector(".modal__close-button_type_preview")

const addCardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = addCardModal.querySelector(
  ".modal__close-button"
);
const cardForm = addCardModal.querySelector(".modal__form");
const cardModalNameInput = addCardModal.querySelector("#add-card-name-input");
const cardModalLinkInput = addCardModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");


function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button-liked");
  })

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  })

  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImage.alt = data.name;
  })

  cardNameEl.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(e) {
  e.preventDefault();
  profileName.textContent = editProfileModalNameInput.value;
  profileDescription.textContent = editProfileModalDescriptionInput.value;
  closeModal(editProfileModal);
}

function handleCardFormSubmit(e) {
  e.preventDefault();
  const inputValues = {name: cardModalNameInput.value, link: cardModalLinkInput.value};
  cardsList.prepend(getCardElement(inputValues));
  cardModalNameInput.value = "";
  cardModalLinkInput.value = "";
  closeModal(addCardModal);
}

profileEditButton.addEventListener("click", () => {
  editProfileModalNameInput.value = profileName.textContent;
  editProfileModalDescriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
});

editProfileModalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(addCardModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
})

editForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);

initialCards.forEach((card) => {
  cardsList.prepend(getCardElement(card));
});
