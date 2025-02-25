import {
  settings,
  disableButton,
  resetValidation,
  enableValidation,
} from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const addCardButton = document.querySelector(".profile__add-button");

// Form elements
const editProfileModal = document.querySelector("#edit-modal");
const editProfileModalCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const editForm = editProfileModal.querySelector(".modal__form");
const editProfileModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button"
);

// Avatar elements
const editAvatarButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarModalSubmitButton = avatarModal.querySelector(
  ".modal__submit-button"
);

// Preview elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

// Card elements
const addCardModal = document.querySelector("#add-card-modal");
const cardModalCloseButton = addCardModal.querySelector(".modal__close-button");
const cardForm = addCardModal.querySelector(".modal__form");
const cardSubmitButton = addCardModal.querySelector(".modal__submit-button");
const cardModalNameInput = addCardModal.querySelector("#add-card-name-input");
const cardModalLinkInput = addCardModal.querySelector("#add-card-link-input");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button"
);
const deleteModalDeleteButton = deleteModal.querySelector(
  ".modal__delete-button"
);
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__cancel-button"
);

let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "062fa761-0e4f-401b-95d7-4545d99a3d6c",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => {
      cardsList.append(getCardElement(card));
    });
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
    profileAvatar.alt = user.name;
  })
  .catch(console.error);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImgEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button-liked");
  } else {
    cardLikeButton.classList.remove("card__like-button-liked");
  }

  cardLikeButton.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImgEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalCaption.textContent = data.name;
    previewModalImage.alt = data.name;
  });

  cardNameEl.textContent = data.name;
  cardImgEl.src = data.link;
  cardImgEl.alt = data.name;

  return cardElement;
}

const handleEscapeClose = (e) => {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
};

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeClose);
}

function handleProfileFormSubmit(e) {
  e.preventDefault();
  renderLoading(editProfileModal, true, "Saving...", "Save");
  api
    .editUserInfo({
      name: editProfileModalNameInput.value,
      about: editProfileModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
      disableButton(editProfileSubmitButton, settings);
    })
    .catch(console.error)
    .finally(renderLoading(editProfileModal, false, "Saving...", "Save"));
}

function handleCardFormSubmit(e) {
  e.preventDefault();
  renderLoading(addCardModal, true, "Saving...", "Save");
  api
    .addPhoto({
      name: cardModalNameInput.value,
      link: cardModalLinkInput.value,
    })
    .then((data) => {
      const inputValues = {
        isLiked: false,
        _id: data._id,
        name: data.name,
        link: data.link,
      };
      cardsList.prepend(getCardElement(inputValues));
      e.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(addCardModal);
    })
    .catch(console.error)
    .finally(renderLoading(addCardModal, false, "Saving...", "Save"));
}

function handleDeleteSubmit(e) {
  e.preventDefault();
  renderLoading(deleteModal, true, "Deleting...", "Delete");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(renderLoading(deleteModal, false, "Deleting...", "Delete"));
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button-liked");
  api
    .toggleLiked(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button-liked");
    })
    .catch(console.error);
}

function handleAvatarFormSubmit(e) {
  e.preventDefault();
  renderLoading(avatarModal, true, "Saving", "Save");
  api
    .editAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
      e.target.reset();
      disableButton(avatarModalSubmitButton, settings);
    })
    .catch(console.error)
    .finally(renderLoading(avatarModal, false, "Saving", "Save"));
}

function renderLoading(container, isLoading, loadingText, defaultText) {
  if (isLoading) {
    container.querySelector(".modal__submit-button").textContent = loadingText;
  } else {
    container.querySelector(".modal__submit-button").textContent = defaultText;
  }
}

profileEditButton.addEventListener("click", () => {
  editProfileModalNameInput.value = profileName.textContent;
  editProfileModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editForm,
    [editProfileModalNameInput, editProfileModalDescriptionInput],
    settings
  );
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

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalDeleteButton.addEventListener("click", handleDeleteSubmit);

editAvatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

editForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

enableValidation(settings);
