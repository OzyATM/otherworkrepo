// This key is for other function to know the current selected node's key
var commentNodeKey;
var multiIndividualNodeKey;
var genderNodeKey;

var EventHandler = {
    deleteNode: deleteNode,
    containGen: containGen,
    sameDisease: sameDisease,
    isPregnant: isPregnant,
    isDead: isDead,
    loadComment: loadComment,
    loadMultiIndividual: loadMultiIndividual,
    loadGenderType: loadGenderType,
    addParent: addParent,
    addElderBrother: addElderBrother,
    addYoungerBrother: addYoungerBrother,
    addElderSister: addElderSister,
    addYoungerSister: addYoungerSister,
    addPartner: addPartner
}

// ***************************************
// Button registration
// ***************************************
function btnRegistration() {
    document.getElementById("confirmBtnOnComment").onclick = changeComment;
    document.getElementById("clearAllComment").onclick = clearAllComment;
    document.getElementById("confirmBtnOnMultiIndividual").onclick = changeMultiIndividualText;
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
    var currentObjectKey = object.part.data.key;
    //delete parentTree's Node
    var previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, currentObjectKey)
    if (previousNode != null) {
        previousNode.left = null;
        previousNode.right = null;
        reRender(previousNode.id);
    }
    // delete node on childrenList
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey);
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentChildList = currentNodeArrayData[0];
    if (NodeCurrentIndex != null) {
        NodeCurrentChildList.splice(NodeCurrentIndex, 1);
        reRender(currentObjectKey);
    }

}

// Generate NodeData based on data storage
// Node data contains:
//  - id
//  - patient
//  - gender
//  - containGen
//  - hasSameDisease
//  - isPragnent
//  - multiInvididualText
//  - isDead
//  - isAdopted
//  - notes (array)
// ***************************************
// Contain Gen Event Handler
// Add a small black circle
// ***************************************
function containGen(e, object) {
    var key = object.part.data.key;
    var node = findNode(key, globalLogicData);
    node.containGen = !node.containGen;
    node.hasSameDisease = false;
    reRender(key);
}

// ***************************************
// Same Disease Event Handler
// Change the fill properties of MainNode
// ***************************************
function sameDisease(e, object) {
    var key = object.part.data.key;
    var node = findNode(key, globalLogicData);
    node.hasSameDisease = !node.hasSameDisease;
    node.containGen = false;
    reRender(key);
}

// ***************************************
// Pregnant Event Handler
// Add a text "P" at the middle and change the color if the background is blacks
// ***************************************
function isPregnant(e, object) {
    var key = object.part.data.key;
    var node = findNode(key, globalLogicData);
    node.isPragnent = !node.isPragnent;
    reRender(key);
}

// ***************************************
// Dead Symbol Event Handler
// Add a slash line
// ***************************************
function isDead(e, object) {
    var key = object.part.data.key;
    var node = findNode(key, globalLogicData);
    node.isDead = !node.isDead;
    reRender(key);
}

// ***************************************
// Add Comment Event Handler
// Load Comment on Node and Display on HTML
// ***************************************
function loadComment(e, object) {
    commentNodeKey = object.part.data.key;
    var node = findNode(commentNodeKey, globalLogicData);
    document.getElementById('NoteOneOnHTML').value = node.notes[0];
    document.getElementById('NoteTwoOnHTML').value = node.notes[1];
    document.getElementById('NoteThreeOnHTML').value = node.notes[2];
    document.getElementById("addCommentBtn").click();
}

// ***************************************
// The confirm Button on CSS for add comment Modal
// ***************************************
function changeComment() {
    var noteOne = document.getElementById('NoteOneOnHTML').value;
    var noteTwo = document.getElementById('NoteTwoOnHTML').value;
    var noteThree = document.getElementById('NoteThreeOnHTML').value;

    var node = findNode(commentNodeKey, globalLogicData);
    node.notes[0] = noteOne;
    node.notes[1] = noteTwo;
    node.notes[2] = noteThree;
    reRender(commentNodeKey);
}

// ***************************************
// Clear all Comment on Node
// ***************************************
function clearAllComment() {
    var node = findNode(commentNodeKey, globalLogicData);
    node.notes = ["", "", ""];
    reRender(commentNodeKey);
}

// ***************************************
// Load MultiIndividual Event Handler
// Load the value from textForMultiIndividual
// ***************************************
function loadMultiIndividual(e, object) {
    multiIndividualNodeKey = object.part.data.key;
    var node = findNode(multiIndividualNodeKey, globalLogicData);
    document.getElementById('textForMultiIndividual').value = node.multiInvididualText;
    document.getElementById("addMultiIndividualBtn").click();
}

// ***************************************
// The confirm Button on CSS for add MultiIndividual Modal
// ***************************************
function changeMultiIndividualText() {
    var node = findNode(multiIndividualNodeKey, globalLogicData);
    node.multiInvididualText = document.getElementById('textForMultiIndividual').value;
    reRender(multiIndividualNodeKey);
}

// ***************************************
// Clear the Multi_Individual value
// ***************************************
function clearMultiIndividualText() {
    var node = findNode(multiIndividualNodeKey, globalLogicData);
    node.multiInvididualText = "";
    reRender(multiIndividualNodeKey);
}

// ***************************************
// Load GenderType Event Handler
// Load the value from gender
// ***************************************
function loadGenderType(e, object) {
    genderNodeKey = object.part.data.key;
    var node = findNode(genderNodeKey, globalLogicData);
    var currentGenderType = node.gender
    if (currentGenderType === "male")
        changeGenderMale.checked = true
    else if (currentGenderType === "female")
        changeGenderFemale.checked = true
    else if (currentGenderType === "baby")
        changeGenderBaby.checked = true
    else if (currentGenderType === "unknown")
        changeGenderUnknown.checked = true

    document.getElementById("changeGenderBtn").click();
}

// ***************************************
// The confirm Button on CSS for add changeGender Modal
// ***************************************
function changeGenderType() {
    var node = findNode(genderNodeKey, globalLogicData);
    if (changeGenderMale.checked)
        node.gender = "male"
    else if (changeGenderFemale.checked)
        node.gender = "female"
    else if (changeGenderBaby.checked)
        node.gender = "baby"
    else if (changeGenderUnknown.checked)
        node.gender = "unknown"
    reRender(genderNodeKey);
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

// ***************************************
// Add Parent Event Handler
// Add Parent On the Graph
// ***************************************
function addParent(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNode = findNode(currentObjectKey, globalLogicData);

    var dad = getDefaultLogicUnitData(uuidv4(), "male");
    var mom = getDefaultLogicUnitData(uuidv4(), "female");
    currentNode.left = dad;
    currentNode.right = mom;
    reRender(currentObjectKey);
}

// ***************************************
// Add Sibling Event Handler
// Add ElderBrother On the Graph
// ***************************************
function addElderBrother(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var elderBrother = getDefaultLogicUnitData(uuidv4(), "male");
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentChildList = currentNodeArrayData[0];

    if (NodeCurrentIndex === 0) {
        NodeCurrentChildList.unshift(elderBrother)
    } else {
        NodeCurrentChildList.splice(NodeCurrentIndex, 0, elderBrother);
    }
    reRender(currentObjectKey);
}

// ***************************************
// Add Sibling Event Handler
// Add ElderSister On the Graph
// ***************************************
function addElderSister(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var elderSister = getDefaultLogicUnitData(uuidv4(), "female");
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentChildList = currentNodeArrayData[0];

    if (NodeCurrentIndex === 0) {
        NodeCurrentChildList.unshift(elderSister)
    } else {
        NodeCurrentChildList.splice(NodeCurrentIndex, 0, elderSister);
    }
    reRender(currentObjectKey);
}

// ***************************************
// Add Sibling Event Handler
// Add YoungerBrother On the Graph
// ***************************************
function addYoungerBrother(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var youngerBrother = getDefaultLogicUnitData(uuidv4(), "male");
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentChildList = currentNodeArrayData[0];

    NodeCurrentChildList.splice(NodeCurrentIndex + 1, 0, youngerBrother);
    reRender(currentObjectKey);
}

// ***************************************
// Add Sibling Event Handler
// Add YoungerSister On the Graph
// ***************************************
function addYoungerSister(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var youngerSister = getDefaultLogicUnitData(uuidv4(), "female");
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentChildList = currentNodeArrayData[0];

    NodeCurrentChildList.splice(NodeCurrentIndex + 1, 0, youngerSister);
    reRender(currentObjectKey);
}

// ***************************************
// Add Partner Event Handler
// Add Partner On the Graph
// ***************************************
function addPartner(e, object) {
    var currentObjectKey = object.part.data.key;
    var partnerNode;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentChildList = currentNodeArrayData[0];

    if (object.part.data.mainFigure === "Square")
        partnerNode = getDefaultLogicUnitData(uuidv4(), "female");
    else if (object.part.data.mainFigure === "Circle")
        partnerNode = getDefaultLogicUnitData(uuidv4(), "male");

    var subTree = {};
    subTree = {
        parentTree: {
            left:,
            right:,

        }
    }


    //var patientSubTree = {};
    //patientSubTree = {
    //    parentTree: {
    //        left: patient,
    //        right: patientWife,
    //        linkNode: "left"
    //    },
    //    childrenList: [
    //    ]
    //}

}