// This key is for other function to know the current selected node's key
var tempNodeKey;

var EventHandler = {
    deleteNode: deleteNode,
    containGen: containGen,
    sameDisease: sameDisease,
    isPregnant: isPregnant,
    isDead: isDead,
    loadComment: loadComment
}

// ***************************************
// Delete Node Event Handler
// Remove specific node from DataModel, then re-render
// ***************************************
function deleteNode(e, object) {
    var node = object.part.adornedPart;
    var nodeKey = node.data.key;
    var objIndex = findCurrentIndex(nodeKey);
    globalDataModel.nodeArray.splice(objIndex, 1);
    mainDiagram.model = generateGoModel(globalDataModel);
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
    mainDiagram.model = generateGoModel(globalDataModel);
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
    mainDiagram.model = generateGoModel(globalDataModel);
}

// ***************************************
// Pregnant Event Handler
// Add a text "P" at the middle and change the color if the background is blacks
// ***************************************
function isPregnant(e, object) {
    var nodeData = object.part.data;
    if (nodeData.figure === "square") {
        alert("It is Male!!!");
        return
    }
    if (!nodeData.isPVisable) {
        nodeData.isPVisable = true;
        nodeData.colorForP = "black";
    } else
        nodeData.isPVisable = false;
    if (nodeData.fill === "black" || nodeData.colorForContainGenCircle === "black")
        nodeData.colorForP = "white";
    mainDiagram.model = generateGoModel(globalDataModel);
}

// ***************************************
// Dead Symbol Event Handler
// Add a slash line
// ***************************************
function isDead(e,object) {
    var nodeData = object.part.data;
    nodeData.deadSymbolVisible = !nodeData.deadSymbolVisible;

    mainDiagram.model = generateGoModel(globalDataModel);
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
    if (globalDataModel.nodeArray[objIndex].noteOne != undefined) {
        document.getElementById('NoteOneOnHTML').value = globalDataModel.nodeArray[objIndex].noteOne;
        document.getElementById('NoteTwoOnHTML').value = globalDataModel.nodeArray[objIndex].noteTwo;
        document.getElementById('NoteThreeOnHTML').value = globalDataModel.nodeArray[objIndex].noteThree;
    }
    else {
        document.getElementById('NoteOneOnHTML').value = "";
        document.getElementById('NoteTwoOnHTML').value = "";
        document.getElementById('NoteThreeOnHTML').value = "";
    }
}

// ***************************************
// Button registration
// ***************************************
function btnRegistration() {
    document.getElementById("confirmBtnOnComment").onclick = addComment;
    document.getElementById("clearAllComment").onclick = clearAllComment;
}

// ***************************************
// The confirm Button on CSS for add comment Modal
// ***************************************
function addComment() {
    var noteOne = document.getElementById('NoteOneOnHTML').value;
    var noteTwo = document.getElementById('NoteTwoOnHTML').value;
    var noteThree = document.getElementById('NoteThreeOnHTML').value;

    var objIndex = findCurrentIndex(tempNodeKey);
    globalDataModel.nodeArray[objIndex].noteOne = noteOne;
    globalDataModel.nodeArray[objIndex].noteTwo = noteTwo;
    globalDataModel.nodeArray[objIndex].noteThree = noteThree;
    mainDiagram.model = generateGoModel(globalDataModel);
}

// ***************************************
// Clear all Comment on Node
// ***************************************
function clearAllComment() {
    var objIndex = findCurrentIndex(tempNodeKey);
    globalDataModel.nodeArray[objIndex].noteOne = "";
    globalDataModel.nodeArray[objIndex].noteTwo = "";
    globalDataModel.nodeArray[objIndex].noteThree = "";
    mainDiagram.model = generateGoModel(globalDataModel);
}