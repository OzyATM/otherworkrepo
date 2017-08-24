var EventHandler = {
    deleteNode: deleteNode,
    containGen: containGen,
    sameDisease: sameDisease,
    isPregnant: isPregnant
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
        if (nodeData.isPVisable)
            nodeData.colorForP = "white";
    }
    else {
        nodeData.colorForContainGenCircle = "white";
        nodeData.containGenVisible = false
        nodeData.colorForP = "black"
    }
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
        if (nodeData.isPVisable)
            nodeData.colorForP = "white";
    }
    else {
        nodeData.fill = "white";
        nodeData.colorForP = "black"
    }
    mainDiagram.model = generateGoModel(globalDataModel);
}

// ***************************************
// Same Disease Event Handler
// Change the fill properties of MainNode
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
    if (nodeData.fill === "black")
        nodeData.colorForP = "white";
    mainDiagram.model = generateGoModel(globalDataModel);
}