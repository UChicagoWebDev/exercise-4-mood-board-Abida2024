const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY;

function insertImagesandTermstoDOM(event) {
  /**
   * Format the response from the Bing API,
   * then insert the similar terms and images to the DOM
   */
  let imageData = formatResponse(event);
  // Insert the suggested search terms
  if (imageData.similarTerms) {
    insertSimilarTerms(imageData.similarTerms);
  }
  // Insert the images into the dom
  if (imageData.images) {
    insertImagestoDom(imageData.images);
  }
}

function formatResponse(event) {
  /**
   * Formats the similarTerms and the images returned
   */
  let data = event.target.response;
  let similarTerms = data.similarTerms
    ? data.similarTerms.map((terms) => terms.text)
    : null;
  // Storing only the url for the websearch
  let images = data.value
    ? data.value.map((image_data) => image_data.contentUrl)
    : null;
  let imageData = { similarTerms: similarTerms, images: images };
  return imageData;
}

function newQuerySearch() {
  /**
   * Helper function to change the input to the selected
   * similar term
   */
  let input = document.body.querySelector("input");
  input.value = event.target.textContent;
  runSearch();
}

function insertSimilarTerms(terms) {
  /**
   * Insert similar terms to the DOM, adding an event listener
   * to call the querySearch again if clicked
   */
  let ul = document.createElement("ul");
  terms.forEach((term_text) => {
    let li = document.createElement("li");
    li.textContent = term_text;
    li.addEventListener("click", newQuerySearch);
    ul.appendChild(li);
  });

  let suggestions = document.body.querySelector(".suggestions");
  suggestions.appendChild(ul);
}

function addImagetoBoard() {
  /**
   * Function to add an image to the saved images to the mood board
   */
  let img = document.createElement("img");
  img.setAttribute("src", event.target["src"]);
  let div = document.createElement("div");
  div.setAttribute("class", "savedImage");
  div.appendChild(img);
  // Add to the board
  let imageBoard = document.body.querySelector("#board");
  imageBoard.appendChild(div);
}

function insertImagestoDom(images) {
  /**
   * Add the returned images to the search pane, adding an event listener
   * to add the image to the saved board on click
   */
  images.forEach((image_url) => {
    // Div with image child
    let div = document.createElement("div");
    div.setAttribute("class", "resultImage");
    let img = document.createElement("img");
    img.setAttribute("src", image_url);
    div.appendChild(img);
    // Add an event listener so clicking on the image adds it to the board
    div.addEventListener("click", addImagetoBoard);
    // Insert as a child node
    let imageContainer = document.body.querySelector("#resultsImageContainer");
    imageContainer.appendChild(div);
  });
}

function runSearch() {
  // TODO: Clear the results pane before you run a new search
  const imageContainer = document.querySelector("#resultsImageContainer");
  const resultImages = imageContainer.querySelectorAll(".resultImage");
  // Remove all the children div with the resultImage class
  resultImages.forEach((resultImage) =>
    imageContainer.removeChild(resultImage)
  );
  // Clear the suggestions as well
  const suggestions = document.querySelector(".suggestions ul");
  if (suggestions) {
    suggestions.remove();
  }

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  // named 'q' that takes the value from the search bar input field
  const inputQuery = document.body.querySelector("input").value;
  const query = bing_api_endpoint + "?q=" + inputQuery;

  let request = new XMLHttpRequest();
  request.addEventListener("load", insertImagesandTermstoDOM);
  request.open("GET", query);

  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = "json";

  // TODO: Send the request
  request.send();

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //

  return false; // Keep this; it keeps the browser from sending the event
  // further up the DOM chain. Here, we don't want to trigger
  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    runSearch();
  }
});

document
  .querySelector("#closeResultsButton")
  .addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    closeResultsPane();
  }
});
