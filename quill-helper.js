/*!
 * Quill Editor Enhanced
 * Copyright (c) 2021, Happiness Munatsi Ncube
 */

// Insert the toolbar
let quill = {};
let input = {};
let dataToBeAdded = '';

function initElementsMap(){
  const font = '<select class="ql-font"></select>';
  const fontSize = '<select class="ql-size"></select>';
          
  const bold = '<button class="ql-bold"></button>';
  const italic = '<button class="ql-italic"></button>';
  const underline = '<button class="ql-underline"></button>';
  const strike = '<button class="ql-strike"></button>';
  
  const fontColor = '<select class="ql-color"></select>';
  const backgroundColor = '<select class="ql-background"></select>';
  
  const subScript = '<button class="ql-script" value="sub"></button>';
  const superScript = '<button class="ql-script" value="super"></button>';
  
  const header1 = '<button class="ql-header" value="1"></button>';
  const header2 = '<button class="ql-header" value="2"></button>';
  const blockquote = '<button class="ql-blockquote"></button>';
  const codeBlock = '<button class="ql-code-block"></button>';
  
  const orderedList = '<button class="ql-list" value="ordered"></button>';
  const bulletList = '<button class="ql-list" value="bullet"></button>';
  const indentNeg = '<button class="ql-indent" value="-1"></button>';
  const indentPos = '<button class="ql-indent" value="+1"></button>';
  
  const rtlDirection = '<button class="ql-direction" value="rtl"></button> ';
  const align = '<select class="ql-align"></select>';
          
  const link = '<button class="ql-link"></button>';
  const image = '<button class="ql-image"></button>';
  const video = '<button class="ql-video"></button>';
          
  /////////////
  const toolbarElementsMap = new Map();
  //toolbarElementsMap.set('k', 'v');
  toolbarElementsMap.set('font', font);
  toolbarElementsMap.set('fontSize', fontSize);
  toolbarElementsMap.set('bold', bold);
  toolbarElementsMap.set('italic', italic);
  toolbarElementsMap.set('undeline',underline);
  toolbarElementsMap.set('strike', strike);
  toolbarElementsMap.set('fontColor', fontColor);
  toolbarElementsMap.set('backgroundColor', backgroundColor);
  toolbarElementsMap.set('subScript', subScript);
  toolbarElementsMap.set('superScript', superScript);
  toolbarElementsMap.set('header1', header1);
  toolbarElementsMap.set('header2', header2);
  toolbarElementsMap.set('blockquote', blockquote);
  toolbarElementsMap.set('codeBlock', codeBlock);
  toolbarElementsMap.set('orderedList', orderedList);
  toolbarElementsMap.set('bulletList', bulletList);
  toolbarElementsMap.set('indentNeg', indentNeg);
  toolbarElementsMap.set('indentPos', indentPos);
  toolbarElementsMap.set('rtlDirection', rtlDirection);
  toolbarElementsMap.set('align', align);
  toolbarElementsMap.set('image', image);
  toolbarElementsMap.set('link', link);
  toolbarElementsMap.set('video', video);

  return toolbarElementsMap;
}
function setDataToBeAdded(data) {
    dataToBeAdded = data;
}
function initEditor({editorElementId ='standalone-container', inputElement = '', include = [], exclude = []}={}){

  const toolbarItems = getToolbarItemsAsString(include, exclude);
  
  init(editorElementId, inputElement, toolbarItems);  
}
function getToolbarItemsAsString(include, exclude){
    const spanStart = '<span class="ql-formats">';
    const spanEnd = '</span>';
    
    const elementsMap = initElementsMap();
  
    let toolbarItems = spanStart;

    //when nothing is passed
    if(include.length == 0 && exclude.length == 0){
      elementsMap.forEach(element => {
        toolbarItems = toolbarItems + element;
      });

    }else if(include.length != 0 && exclude.length == 0){ //include
      include.forEach(i => {
        toolbarItems = toolbarItems + elementsMap.get(i);
      });
    }else if(include.length == 0 && exclude.length != 0){ //exclude
    let tempMap = elementsMap;
    exclude.forEach(i => {
      tempMap.delete(i);
    });
    tempMap.forEach(element => {
      toolbarItems = toolbarItems + element;
    });
    }

    toolbarItems = toolbarItems + spanEnd;
    return toolbarItems;
}
function init(editorElementId, inputElement, toolbarItems) {
    let container = document.getElementById(editorElementId);
    if (container == null) {
        console.log("There is no element with the id "+ editorElementId + " in your page.");
        return;
    }

    //very ugly string
    let htmlString = '<div id="toolbar-container">' + 
        toolbarItems +
        '</div><div spellcheck="true" id="editor-container"></div>';

    container.innerHTML = htmlString;

    quill = new Quill('#editor-container', {
        modules: {
            syntax: true,
            toolbar: '#toolbar-container'
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    });

    //if it is null then no editing is allowed 
    if(inputElement !== ''){
      input = document.getElementById(inputElement); 
      //check if the element exists on the page
      if (Object.keys(input).length === 0 && input.constructor === Object) {
        quill.disable();
      } else {
          quill.on('text-change', function (delta, oldDelta, source) {
              if (delta !== oldDelta) {
                  let inputValue = getEditorData();
                  input.value = inputValue;
              }
          });
      }
    }else{
      quill.disable();
    }
    

    if (dataToBeAdded !== '') {
        loadDataToEditor(dataToBeAdded);
    }
}
function getEditorData() {
    let delta = quill.getContents();
    let data = JSON.stringify(delta);
    return replaceAllNewLine(data);
}
function loadDataToEditor(stringData) {
    var unstrobj = JSON.parse(removeNewLineEscapes(stringData));
    quill.setContents(unstrobj);
}
function removeNewLineEscapes(dbString) {
    const strArray = dbString.split('\\n');
    let result = "";
    for (var i = 0; i < strArray.length; i++) {
        if (i != strArray.length - 1) {
            result = result + strArray[i] + "n";
        } else {
            result = result + strArray[i];
        }
    }
    return result;
}
function replaceAllNewLine(string) {
    const strArray = string.split('\\n');
    let result = "";
    for (var i = 0; i < strArray.length; i++) {
        if (i != strArray.length - 1) {
            result = result + strArray[i] + "\\" + "\\n";
        } else {
            result = result + strArray[i];
        }
    }
    return result;
}
