export default function editorContentsToHTML(editorContents) {
  let mainEditor = editorContents;

  // remove "data-offset-key" attrs and unwrap
  let elements = mainEditor.querySelectorAll("[data-offset-key]");
  elements.forEach((element) => {
    element.removeAttribute("data-offset-key");
    if (!element.attributes.length) {
      element.innerHTML = element.firstChild.innerHTML;
    }
  });

  // convert page breaks
  elements = mainEditor.querySelectorAll(".PageBreakEditor");
  elements.forEach((element) => {
    element.innerHTML = "";
    element.removeAttribute("contenteditable");
    element.removeAttribute("class");
    element.setAttribute("class", "page-break");
  });

  // remove DraftStyleDefault related classes and unwrap
  elements = mainEditor.querySelectorAll(".public-DraftStyleDefault-block");
  elements.forEach((element) => {
    element.classList.remove("public-DraftStyleDefault-ltr");
    element.classList.remove("public-DraftStyleDefault-block");
    element.outerHTML = element.innerHTML;
  });

  // remove data-block attr
  elements = mainEditor.querySelectorAll("[data-block]");
  elements.forEach((element) => {
    element.removeAttribute("data-block");
  });

  // remove span without style and attrs
  elements = mainEditor.querySelectorAll("span");
  elements.forEach((element) => {
    if (!element.attributes.length && !element.style.length) {
      element.outerHTML = element.innerHTML;
    }
  });

  // unwrap blocks with data-text attrs
  elements = mainEditor.querySelectorAll("[data-text]");
  elements.forEach((element) => {
    element.outerHTML = element.innerHTML;
  });

  return mainEditor.innerHTML;
}
