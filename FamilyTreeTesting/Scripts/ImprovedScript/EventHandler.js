// This key is for other function to know the current selected node's key
var tempNodeKey;

var EventHandler = {
    deleteNode: deleteNode,
    containGen: containGen,
    sameDisease: sameDisease,
    isPregnant: isPregnant,
    isDead: isDead,
    loadComment: loadComment,
    loadMultiIndividual: loadMultiIndividual,
    loadGenderType: loadGenderType
}

// ***************************************
// Button registration
// ***************************************
function btnRegistration() {
    document.getElementById("confirmBtnOnComment").onclick = addComment;
    document.getElementById("clearAllComment").onclick = clearAllComment;
    document.getElementById("confirmBtnOnMultiIndividual").onclick = addMultiIndividual;
    document.getElementById("clearMultiIndividual").onclick = clearMultiIndividualText;
    document.getElementById("confirmBtnOnChangeGender").onclick = changeGenderType;
    document.getElementById("increaseZoom").onclick = increaseZoom;
    document.getElementById("decreaseZoom").onclick = decreaseZoom;
    document.getElementById("zoomToFit").onclick = zoomToFit;
}

// ***************************************
// Delete Node Event Handler
// Remove specific node from DataModel, then re-render
// ***************************************
function deleteNode(e, object) {
    var node = object.part.adornedPart;
    var nodeKey = node.data.key;
    var objIndex = findCurrentIndex(nodeKey);
    globalRenderData.nodeArray.splice(objIndex, 1);
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Contain Gen Event Handler
// Add a small black circle
// ***************************************
function containGen(e, object) {
    var nodeData = object.part.data;
    if (nodeData.colorForContainGenCircle != "black") {
        nodeData.colorForContainGenCircle = "black";
        nodeData.containGenVisible = true;
    }
    else {
        nodeData.colorForContainGenCircle = "white";
        nodeData.containGenVisible = false;
    }
    if (nodeData.isPVisable && (nodeData.fill === "black" || nodeData.colorForContainGenCircle === "black"))
        nodeData.colorForP = "white";
    else
        nodeData.colorForP = "black";
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Same Disease Event Handler
// Change the fill properties of MainNode
// ***************************************
function sameDisease(e, object) {
    var nodeData = object.part.data;
    if (nodeData.fill != "black") {
        nodeData.fill = "black";
        nodeData.colorForContainGenCircle = "white";
        nodeData.containGenVisible = false;
    }
    else {
        nodeData.fill = "transparent";
        nodeData.colorForContainGenCircle = "white";
        nodeData.containGenVisible = false;
    }
    if (nodeData.isPVisable && (nodeData.fill === "black" || nodeData.colorForContainGenCircle === "black"))
        nodeData.colorForP = "white";
    else
        nodeData.colorForP = "black";
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Pregnant Event Handler
// Add a text "P" at the middle and change the color if the background is blacks
// ***************************************
function isPregnant(e, object) {
    var nodeData = object.part.data;
    if (!nodeData.isPVisable) {
        nodeData.isPVisable = true;
        nodeData.colorForP = "black";
    } else
        nodeData.isPVisable = false;
    if (nodeData.fill === "black" || nodeData.colorForContainGenCircle === "black")
        nodeData.colorForP = "white";
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Dead Symbol Event Handler
// Add a slash line
// ***************************************
function isDead(e,object) {
    var nodeData = object.part.data;
    nodeData.deadSymbolVisible = !nodeData.deadSymbolVisible;

    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Add Comment Event Handler
// Load Comment on Node and Display on HTML
// ***************************************
function loadComment(e, object) {
    var nodeData = object.part.data;
    tempNodeKey = nodeData.key;
    var objIndex = findCurrentIndex(tempNodeKey);
    document.getElementById("addCommentBtn").click();
    if (globalRenderData.nodeArray[objIndex].noteOne != undefined) {
        document.getElementById('NoteOneOnHTML').value = globalRenderData.nodeArray[objIndex].noteOne;
        document.getElementById('NoteTwoOnHTML').value = globalRenderData.nodeArray[objIndex].noteTwo;
        document.getElementById('NoteThreeOnHTML').value = globalRenderData.nodeArray[objIndex].noteThree;
    }
    else {
        document.getElementById('NoteOneOnHTML').value = "";
        document.getElementById('NoteTwoOnHTML').value = "";
        document.getElementById('NoteThreeOnHTML').value = "";
    }
}

// ***************************************
// The confirm Button on CSS for add comment Modal
// ***************************************
function addComment() {
    var noteOne = document.getElementById('NoteOneOnHTML').value;
    var noteTwo = document.getElementById('NoteTwoOnHTML').value;
    var noteThree = document.getElementById('NoteThreeOnHTML').value;

    var objIndex = findCurrentIndex(tempNodeKey);
    globalRenderData.nodeArray[objIndex].noteOne = noteOne;
    globalRenderData.nodeArray[objIndex].noteTwo = noteTwo;
    globalRenderData.nodeArray[objIndex].noteThree = noteThree;
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Clear all Comment on Node
// ***************************************
function clearAllComment() {
    var objIndex = findCurrentIndex(tempNodeKey);
    globalRenderData.nodeArray[objIndex].noteOne = "";
    globalRenderData.nodeArray[objIndex].noteTwo = "";
    globalRenderData.nodeArray[objIndex].noteThree = "";
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Load MultiIndividual Event Handler
// Load the value from textForMultiIndividual
// ***************************************
function loadMultiIndividual(e, object) {
    var nodeData = object.part.data;
    tempNodeKey = nodeData.key;
    var objIndex = findCurrentIndex(tempNodeKey);
    document.getElementById("addMultiIndividualBtn").click();
    if (globalRenderData.nodeArray[objIndex].textForMultiIndividual != undefined)
        document.getElementById('textForMultiIndividual').value = globalRenderData.nodeArray[objIndex].textForMultiIndividual;
    else
        document.getElementById('textForMultiIndividual').value = "";
}

// ***************************************
// The confirm Button on CSS for add MultiIndividual Modal
// ***************************************
function addMultiIndividual() {
    var multiIndividualText = document.getElementById('textForMultiIndividual').value;
    var objIndex = findCurrentIndex(tempNodeKey);
    globalRenderData.nodeArray[objIndex].textForMultiIndividual = multiIndividualText;
    globalRenderData.nodeArray[objIndex].isMultiIndividualVisable = true;
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Clear the Multi_Individual value
// ***************************************
function clearMultiIndividualText() {
    var objIndex = findCurrentIndex(tempNodeKey);
    globalRenderData.nodeArray[objIndex].textForMultiIndividual = "";
    globalRenderData.nodeArray[objIndex].isMultiIndividualVisable = false;
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// Load GenderType Event Handler
// Load the value from gender
// ***************************************
function loadGenderType(e, object) {
    var nodeData = object.part.data;
    tempNodeKey = nodeData.key;
    var objIndex = findCurrentIndex(tempNodeKey);
    document.getElementById("changeGenderBtn").click();
    var currentGenderType = globalRenderData.nodeArray[objIndex].gender
    if (currentGenderType === "male")
        changeGenderMale.checked = true
    else if (currentGenderType === "female")
        changeGenderFemale.checked = true
    else if (currentGenderType === "baby")
        changeGenderBaby.checked = true
    else if (currentGenderType === "unknown")
        changeGenderUnknown.checked = true
}

// ***************************************
// The confirm Button on CSS for add changeGender Modal
// ***************************************
function changeGenderType() {
    var objIndex = findCurrentIndex(tempNodeKey);
    if (changeGenderMale.checked)
        globalRenderData.nodeArray[objIndex].gender = "male"
    else if (changeGenderFemale.checked)
        globalRenderData.nodeArray[objIndex].gender = "female"
    else if (changeGenderBaby.checked)
        globalRenderData.nodeArray[objIndex].gender = "baby"
    else if (changeGenderUnknown.checked)
        globalRenderData.nodeArray[objIndex].gender = "unknown"
    mainDiagram.model = generateGoModel(globalRenderData);
}

// ***************************************
// The Zooming function
// incraseZoom - increaase zoom
// decraseZoom - decrease zoom
// zoomToFit - move the oject to center
// ***************************************
function increaseZoom() {
    var increaseZoomOriginalSize = 1.1;
    mainDiagram.commandHandler.increaseZoom(increaseZoomOriginalSize);
}
function decreaseZoom() {
    var decreaseZoomOriginalSize = 0.9;
    mainDiagram.commandHandler.increaseZoom(decreaseZoomOriginalSize);
}
function zoomToFit() {
    mainDiagram.zoomToFit();
    mainDiagram.contentAlignment = go.Spot.Center;
    mainDiagram.contentAlignment = go.Spot.Default;
}