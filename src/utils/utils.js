function renderLoading(container, isLoading, loadingText, defaultText) {
  const submitButton = container.querySelector(".modal__submit-button");
  if (isLoading) {
    submitButton.textContent = loadingText;
  } else {
    submitButton.textContent = defaultText;
  }
}

export { renderLoading };
