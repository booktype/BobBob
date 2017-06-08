export default function editorContentsToHTML(editorContents){
  let mainEditor = editorContents
  let elements = mainEditor.querySelectorAll("[data-offset-key]")
  elements.forEach((element)=>{
    element.removeAttribute("data-offset-key")
    if(!element.attributes.length){

      element.innerHTML = element.firstChild.innerHTML
    }
  })

  elements = mainEditor.querySelectorAll("[contenteditable]")
  // elements.forEach((element)=>{
  //   element.outerHTML = element.innerHTML
  // })
  elements = mainEditor.querySelectorAll(".public-DraftStyleDefault-block")
  elements.forEach((element)=>{
    element.classList.remove("public-DraftStyleDefault-ltr")
    element.classList.remove("public-DraftStyleDefault-block")
    element.outerHTML = element.innerHTML
  })
  elements = mainEditor.querySelectorAll("[data-block]")
  elements.forEach((element)=>{
    delete element.dataset.block
  })
  elements = mainEditor.querySelectorAll("span")
  elements.forEach((element)=>{
    if(!element.attributes.length && !element.style.length){
      element.outerHTML = element.innerHTML
    }
  })
  elements = mainEditor.querySelectorAll("[data-text]")
  elements.forEach((element)=>{
    element.outerHTML = element.innerHTML
  })
  return mainEditor.innerHTML
}
