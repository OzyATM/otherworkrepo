var EventHandler = {
    deleteNode: deleteNode,
    containGen: containGen,
    sameDisease: sameDisease,
    isPregnant: isPregnant,
    isDead: isDead
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
        nodeData.containGenVisible = true
    }
    else {
        nodeData.colorForContainGenCircle = "white";
        nodeData.containGenVisible = false
    }
    if (nodeData.isPVisable && (nodeData.fill === "black" || nodeData.colorForContainGenCircle === "black"))
        nodeData.colorForP = "white"
    else
        nodeData.colorForP = "black"
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
        nodeData.colorForContainGenCircle = "white"
        nodeData.containGenVisible = false;
    }
    else {
        nodeData.fill = "transparent";
        nodeData.colorForContainGenCircle = "white"
        nodeData.containGenVisible = false;
    }
    if (nodeData.isPVisable && (nodeData.fill === "black" || nodeData.colorForContainGenCircle === "black"))
        nodeData.colorForP = "white"
    else
        nodeData.colorForP = "black"
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
    if (!nodeData.deadSymbolVisible)
        nodeData.deadSymbolVisible = true;
    else
        nodeData.deadSymbolVisible = false;
    mainDiagram.model = generateGoModel(globalDataModel);
}