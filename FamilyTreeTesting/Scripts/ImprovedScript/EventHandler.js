// This key is for other function to know the current selected node's key
var commentNodeKey;
var multiIndividualNodeKey;
var genderNodeKey;
var globalState = {
    tool: null,
    LocX: -200,
    LocY: 50,
}

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
    addPartner: addPartner,
    addSon: addSon,
    addDaughter: addDaughter
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
    document.getElementById("freedraw").onclick = freeDraw;
    document.getElementById("comment").onclick = addCommentBox;
}

// ***************************************
// Delete Node Event Handler
// Remove specific node from DataModel, then re-render
// ***************************************
function deleteNode(e, object) {
    var currentObjectKey = object.part.data.key;
    var newNode;
    //delete parentTree's Node
    var previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, currentObjectKey)
    if (previousNode != null) {
        previousNode.left = null;
        previousNode.right = null;
        reRender(previousNode.id);
        return;
    }

    // delete node on childrenList
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey);
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentchildrenList = currentNodeArrayData[0];
    if (NodeCurrentchildrenList[NodeCurrentIndex].parentTree) {
        var mainNodePosition = NodeCurrentchildrenList[NodeCurrentIndex].parentTree.linkNode
        // check weather the node that want to be deleted is child or partner, if it is not partner delete the node, else delete the partner
        if ((mainNodePosition === "left" && NodeCurrentchildrenList[NodeCurrentIndex].parentTree.left.id === currentObjectKey) ||
            (mainNodePosition === "right" && NodeCurrentchildrenList[NodeCurrentIndex].parentTree.right.id === currentObjectKey))
        {
            NodeCurrentchildrenList.splice(NodeCurrentIndex, 1);
            reRender(currentObjectKey);
            return;
        } else if (mainNodePosition === "left") {
            newNode = NodeCurrentchildrenList[NodeCurrentIndex].parentTree.left;
        } else if (mainNodePosition === "right") {
            newNode = NodeCurrentchildrenList[NodeCurrentIndex].parentTree.right;
        }

        NodeCurrentchildrenList.splice(NodeCurrentIndex, 1);
        NodeCurrentchildrenList.splice(NodeCurrentIndex, 0, newNode);
        reRender(currentObjectKey);
        return;
    } else {
        NodeCurrentchildrenList.splice(NodeCurrentIndex, 1);
        reRender(currentObjectKey);
        return;
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
//  - canBeDeleted
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
    var NodeCurrentchildrenList = currentNodeArrayData[0];

    if (NodeCurrentIndex === 0) {
        NodeCurrentchildrenList.unshift(elderBrother)
    } else {
        NodeCurrentchildrenList.splice(NodeCurrentIndex, 0, elderBrother);
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
    var NodeCurrentchildrenList = currentNodeArrayData[0];

    if (NodeCurrentIndex === 0) {
        NodeCurrentchildrenList.unshift(elderSister)
    } else {
        NodeCurrentchildrenList.splice(NodeCurrentIndex, 0, elderSister);
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
    var NodeCurrentchildrenList = currentNodeArrayData[0];

    NodeCurrentchildrenList.splice(NodeCurrentIndex + 1, 0, youngerBrother);
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
    var NodeCurrentchildrenList = currentNodeArrayData[0];

    NodeCurrentchildrenList.splice(NodeCurrentIndex + 1, 0, youngerSister);
    reRender(currentObjectKey);
}

// ***************************************
// Add Partner Event Handler
// Add Partner On the Graph
// ***************************************
function addPartner(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeDataOnGlobalLogicalData = findNode(currentObjectKey, globalLogicData)
    var leftNode, rightNode
    var linkNode;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentchildrenList = currentNodeArrayData[0];

    if (object.part.data.mainFigure === "Square") {
        leftNode = currentNodeDataOnGlobalLogicalData
        rightNode = getDefaultLogicUnitData(uuidv4(), "female");
        linkNode = "left";
    } else if (object.part.data.mainFigure === "Circle"){
        leftNode = getDefaultLogicUnitData(uuidv4(), "male");
        rightNode = currentNodeDataOnGlobalLogicalData
        linkNode = "right";
    }

    var subTree = {};
    subTree = {
        parentTree: {
            left:leftNode,
            right: rightNode,
            linkNode: linkNode,
            relation: {
                marriageStatus: "married",
            }
        },
        childrenList: [
        ]
    }

    NodeCurrentchildrenList.splice(NodeCurrentIndex, 1);
    NodeCurrentchildrenList.splice(NodeCurrentIndex, 0, subTree);
    reRender(currentObjectKey);
}

// ***************************************
// Add Son Event Handler
// Add Son On the Graph
// ***************************************
function addSon(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentchildrenList = currentNodeArrayData[0];
    var son = getDefaultLogicUnitData(uuidv4(), "male");

    // if it doesnt has partner it will automatically add partner
    if (!NodeCurrentchildrenList[NodeCurrentIndex].childrenList) {
        addPartner(e, object);
    }
    NodeCurrentchildrenList[NodeCurrentIndex].childrenList.push(son)

    reRender(currentObjectKey);
}

// ***************************************
// Add Daughter Event Handler
// Add Daughter On the Graph
// ***************************************
function addDaughter(e, object) {
    var currentObjectKey = object.part.data.key;
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    var NodeCurrentIndex = currentNodeArrayData[1];
    var NodeCurrentchildrenList = currentNodeArrayData[0];
    var daughter = getDefaultLogicUnitData(uuidv4(), "female");

    // if it doesnt has partner it will automatically add partner
    if (!NodeCurrentchildrenList[NodeCurrentIndex].childrenList) {
        addPartner(e, object);
    }
    NodeCurrentchildrenList[NodeCurrentIndex].childrenList.push(daughter)

    reRender(currentObjectKey);
}

// ***************************************
// Add CareTaker Event Handler
// Add CareTaker On the Graph
// ***************************************
function addCareTaker(gender) {
    var careTakerNode, categoryType
    var setObjLoc = go.Point.stringify(new go.Point(globalState.LocX, globalState.LocY))

    if (gender === "male")
        categoryType = "CareMale"
    else if (gender === "female")
        categoryType = "CareFemale"

    careTakerNode = { category: categoryType, loc: setObjLoc };
    mainDiagram.model.addNodeData(careTakerNode);

    // update globalLoc
    globalState.LocX += 5
    globalState.LocY += 5
}

// ***************************************
// Save the Graph to Base64 (Image) string
// ***************************************
function saveImg() {
    var ImgBaseString = mainDiagram.makeImageData({ background: "white" });
    return ImgBaseString;
}

// ***************************************
// Add Free Draw Tool Event Handler 
// ***************************************
function freeDraw() {
    mainDiagram.toolManager.panningTool.isEnabled = false;
    // create drawing tool for mainDiagram, defined in FreehandDrawingTool.js
    var tool = new FreehandDrawingTool();
    // provide the default JavaScript object for a new polygon in the model
    tool.archetypePartData =
        { stroke: "black", strokeWidth: 5, category: "FreehandDrawing" };
    // install as last mouse-move-tool
    mainDiagram.toolManager.mouseMoveTools.add(tool);
    globalState.tool = tool;
    this.onclick = cancelFreeDraw;
    document.getElementById("freedraw").innerHTML = '<img id="freedraw_img" width="20" height="20" style="margin:2px"/>' + " 完成"
    document.getElementById("freedraw_img").src = APPLICATION_ROOT + "Content/done.png";

}

// ***************************************
// Remove Free Draw Tool Event Handler 
// ***************************************
function cancelFreeDraw() {
    mainDiagram.toolManager.panningTool.isEnabled = true;
    mainDiagram.toolManager.mouseMoveTools.remove(globalState.tool);
    globalState.tool = null;
    this.onclick = freeDraw;
    document.getElementById("freedraw").innerHTML = '<img id="freedraw_img" width="20" height="20" style="margin:2px"/>' + " 圈選同住者"
    document.getElementById("freedraw_img").src = APPLICATION_ROOT + "Content/together.png";

}

// ***************************************
// Add Comment Box Event Handler 
// ***************************************
function addCommentBox() {
    var Comment_node
    var setObjLoc = go.Point.stringify(new go.Point(globalState.LocX, globalState.LocY))

    Comment_node = { category: "CommentBox", text: "請輸入文字", loc: setObjLoc };
    mainDiagram.model.addNodeData(Comment_node);
    // update globalLoc
    globalState.LocX += 5
    globalState.LocY += 5
}