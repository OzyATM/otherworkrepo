var EventHandler = {
    deleteNode: deleteNode
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