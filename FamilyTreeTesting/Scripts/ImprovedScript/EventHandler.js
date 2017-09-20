// This key is for other function to know the current selected node's key
var commentNodeKey;
var multiIndividualNodeKey;
var genderNodeKey;
var commentBoxKey = -1
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
    addDaughter: addDaughter,
    changeMarriageStatusToUnmarriage: changeMarriageStatusToUnmarriage,
    changeMarriageStatusToMarriage: changeMarriageStatusToMarriage,
    changeMarriageStatusToDivorce: changeMarriageStatusToDivorce,
    isAdopted: isAdopted,
    gotAdopted: gotAdopted,
    isOwnChild: isOwnChild
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

    document.getElementById("bold").onclick = changetextbold;
    document.getElementById("italic").onclick = changetextitalic;
    document.getElementById("underline").onclick = changetextunderline;
    document.getElementById("strikethrough").onclick = changetextstrikethrough;
    document.getElementById("fontsize").onclick = clicktextsize;
    document.getElementById("fontsize").onchange = changetextsize;
    document.getElementById("fontstyle").onclick = clicktextstyle;
    document.getElementById("fontstyle").onchange = changetextstyle;
}

// ***************************************
// Delete Node Event Handler
// Remove specific node from DataModel, then re-render
// ***************************************
function deleteNode(e, object) {
    swal({
        title: "確定要刪除？",
        type: "warning",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "確定",
        closeOnConfirm: true
    },

       function (isConfirm) {
           if (isConfirm) {
               var currentObjectKey = object.part.data.key;
               var currentObjectCategory = object.part.data.category

               if (currentObjectCategory === "CareMale" || currentObjectCategory === "CareFemale" || currentObjectCategory === "FreehandDrawing" || currentObjectCategory === "CommentBox") {
                   mainDiagram.commandHandler.deleteSelection();
                   commentBoxKey = -1;
                   return
               }

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
               var NodeCurrentIndex = currentNodeArrayData.index;
               var NodeCurrentchildrenList = currentNodeArrayData.childrenList;
               if (NodeCurrentchildrenList[NodeCurrentIndex].parentTree) {
                   var mainNodePosition = NodeCurrentchildrenList[NodeCurrentIndex].parentTree.linkNode
                   // check weather the node that want to be deleted is child or partner, if it is not partner delete the node, else delete the partner
                   if ((mainNodePosition === "left" && NodeCurrentchildrenList[NodeCurrentIndex].parentTree.left.id === currentObjectKey) ||
                       (mainNodePosition === "right" && NodeCurrentchildrenList[NodeCurrentIndex].parentTree.right.id === currentObjectKey)) {

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
           } else {
               return false;
           }
       }
    );
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
    currentNode.marriageStatus = "married";
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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;

    NodeCurrentchildrenList.splice(NodeCurrentIndex, 0, elderBrother);
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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;

    NodeCurrentchildrenList.splice(NodeCurrentIndex, 0, elderSister);
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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;

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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;

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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;

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
            marriageStatus: "married"
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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;
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
    var NodeCurrentIndex = currentNodeArrayData.index;
    var NodeCurrentchildrenList = currentNodeArrayData.childrenList;
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

    careTakerNode = { category: categoryType, loc: setObjLoc, key: uuidv4() };
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
        { stroke: "black", strokeWidth: 5, category: "FreehandDrawing", key: uuidv4() };
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
    reRender();
}

// ***************************************
// Add Comment Box Event Handler 
// ***************************************
function addCommentBox() {
    var Comment_node
    var setObjLoc = go.Point.stringify(new go.Point(globalState.LocX, globalState.LocY))

    Comment_node = { category: "CommentBox", text: "請輸入文字", loc: setObjLoc, key: uuidv4() };
    mainDiagram.model.addNodeData(Comment_node);
    // update globalLoc
    globalState.LocX += 5
    globalState.LocY += 5
}

// ***************************************
// Change Marriage Status Event Handler
// Chnage The Marriage Status to Unmarried, The Link will become Dash-Line
// ***************************************
function changeMarriageStatusToUnmarriage(e, object) {
    var previousNode = null
    var leftNodeIDThatLinkFrom = object.part.data.from;
    previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, leftNodeIDThatLinkFrom);
    if (previousNode === null) {
        var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, leftNodeIDThatLinkFrom)
        var currentChildList = currentNodeArrayData.childrenList;
        var currentNodeIndex = currentNodeArrayData.index;

        currentChildList[currentNodeIndex].parentTree.marriageStatus = "unmarried";
    } else {
        previousNode.marriageStatus = "unmarried";
    }
    reRender(null);
    return;
}

// ***************************************
// Change Marriage Status Event Handler
// Chnage The Marriage Status to married, The Link will become Normal Line
// ***************************************
function changeMarriageStatusToMarriage(e, object) {
    var previousNode = null
    var leftNodeIDThatLinkFrom = object.part.data.from;
    previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, leftNodeIDThatLinkFrom);
    if (previousNode === null) {
        var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, leftNodeIDThatLinkFrom)
        var currentChildList = currentNodeArrayData.childrenList;
        var currentNodeIndex = currentNodeArrayData.index;

        currentChildList[currentNodeIndex].parentTree.marriageStatus = "married";
    } else {
        previousNode.marriageStatus = "married";
    }
    reRender(null);
    return;
}

// ***************************************
// Change Marriage Status Event Handler
// Chnage The Marriage Status to Divorce, The Link will become Normal Line and The LinkLabel will change to Two Slash-Line
// ***************************************
function changeMarriageStatusToDivorce(e, object) {
    var previousNode = null
    var leftNodeIDThatLinkFrom = object.part.data.from;
    previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, leftNodeIDThatLinkFrom);
    if (previousNode === null) {
        var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, leftNodeIDThatLinkFrom)
        var currentChildList = currentNodeArrayData.childrenList;
        var currentNodeIndex = currentNodeArrayData.index;

        currentChildList[currentNodeIndex].parentTree.marriageStatus = "divorce";
    } else {
        previousNode.marriageStatus = "divorce";
    }
    reRender(null);
    return;
}

// ***************************************
// Change Child Status Event Handler
// Chnage Child Status to isAdpoted
// ***************************************
function isAdopted(e, object) {
    var currentObjectKey = object.part.data.key;
    var node = findNode(currentObjectKey, globalLogicData);
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    // if it doesn't have parent and it is not in a child List it will automatically add parent
    if ((!node.left || !node.right) && currentNodeArrayData.childrenList === null) {
        addParent(e, object);
    }
    node.isAdopted = true;
    node.gotAdopted = false;
    reRender(currentObjectKey);
}

// ***************************************
// Change Child Status Event Handler
// Chnage Child Status to gotAdopted
// ***************************************
function gotAdopted(e, object) {
    var currentObjectKey = object.part.data.key;
    var node = findNode(currentObjectKey, globalLogicData);
    var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, currentObjectKey)
    // if it doesn't have parent and it is not in a child List it will automatically add parent
    if ((!node.left || !node.right) && currentNodeArrayData.childrenList === null) {
        addParent(e, object);
    }
    node.gotAdopted = true;
    node.isAdopted = false;
    reRender(currentObjectKey);
}

// ***************************************
// Change Child Status Event Handler
// Chnage Child Status to isOwnChild
// ***************************************
function isOwnChild(e, object) {
    var currentObjectKey = object.part.data.key;
    var node = findNode(currentObjectKey, globalLogicData);
    node.isAdopted = false;
    node.gotAdopted = false;
    reRender(currentObjectKey);
    return;
}

// ***************************************
// General Event Handler
// Object Single Click
// ***************************************
function objectSingleClicked(e) {
    var part = e.subject.part
    if (part.data.category === "CommentBox") {
        commentBoxKey = part.data.key
        setDefaultNaviBar(part)
    }
}

// ***************************************
// General Event Handler
// Background Single Click
// ***************************************
function backGroundSingleClicked(e) {
    disableClickOnNaviBarForTextBlock();
    if (commentBoxKey != -1) {
        var currentIndex = findCurrentIndex(commentBoxKey);
        if (mainDiagram.model.nodeDataArray[currentIndex].text === "") {
            mainDiagram.model.nodeDataArray[currentIndex].text = "請輸入文字";
        }
    }
    mainDiagram.rebuildParts();
}

// ***************************************
// Chnage The Button Color on the Top Navi-Bar 
// ***************************************
function changeNaviBarBtnColor(nodePart, textStyle) {
    var part = nodePart
    var inputTextStyle = textStyle

    if (!part.data[inputTextStyle])
        document.getElementById(inputTextStyle).style.backgroundColor = "white"
    else
        document.getElementById(inputTextStyle).style.backgroundColor = "#ff8c00"
}

// ***************************************
// FontSize and Type on Navi-Bar 
// ***************************************
function fontSizeTypeOnNaviBar(nodePart, fontSizeStyle, value) {
    var part = nodePart
    var inputSizeStype = fontSizeStyle
    var inputValue = value
    var fontStyleSetting;
    if (fontSizeStyle === "fontstyle")
        fontStyleSetting = $('#fontstyle2').text("新細明體");
    else
        fontStyleSetting = document.getElementById(inputSizeStype).value = inputValue

    if (!part.data[inputSizeStype])
        fontStyleSetting
    else
        document.getElementById(inputSizeStype).value = part.data[inputSizeStype]
}

// ***************************************
// Set The Navi-Bar on top to Default
// ***************************************
function setDefaultNaviBar(nodePart) {
    var part = nodePart
    tempKey = part.data.key
    document.getElementById("bold").value = part.data.bold
    document.getElementById("italic").value = part.data.Italic
    document.getElementById("underline").value = part.data.isUnderline
    document.getElementById("strikethrough").value = part.data.isStrikethrough
    document.getElementById("fontsize").value = part.data.fontsize
    $('#fontstyle2').text(part.data.fontstyle)

    $("#bold").removeClass("disabled");
    $("#italic").removeClass("disabled");
    $("#underline").removeClass("disabled");
    $("#strikethrough").removeClass("disabled");
    $(".btn-md").removeClass("disabled");
    $('#fontselect').removeClass("disabledbutton");
    $('#fontselect-drop').removeClass("display");
    document.getElementById("fontsize").disabled = false

    changeNaviBarBtnColor(part, "bold")
    changeNaviBarBtnColor(part, "italic")
    changeNaviBarBtnColor(part, "underline")
    changeNaviBarBtnColor(part, "strikethrough")

    fontSizeTypeOnNaviBar(part, "fontsize", "12")
    fontSizeTypeOnNaviBar(part, "fontstyle", "新細明體")

}

// ***************************************
// Disable Navi-Bar If it is not Select The Text Block 
// ***************************************
function disableClickOnNaviBarForTextBlock() {
    $("#bold").addClass("disabled");
    $("#italic").addClass("disabled");
    $("#underline").addClass("disabled");
    $("#strikethrough").addClass("disabled");
    $(".btn-md").addClass("disabled");
    $('#fontselect').addClass("disabledbutton");
    $('#fontselect-drop').addClass("display");
    $('#fontstyle2').text("新細明體");
    document.getElementById("bold").style.backgroundColor = "white"
    document.getElementById("italic").style.backgroundColor = "white"
    document.getElementById("underline").style.backgroundColor = "white"
    document.getElementById("strikethrough").style.backgroundColor = "white"
    document.getElementById("fontsize").value = "12"
    document.getElementById("fontsize").disabled = true
}

// ***************************************
// Chnage Text to Bold 
// ***************************************
function changetextbold() {
    var currentIndex = findCurrentIndex(tempKey);
    if (mainDiagram.model.nodeDataArray[currentIndex].bold) {
        mainDiagram.model.nodeDataArray[currentIndex].bold = false
    }
    else {
        mainDiagram.model.nodeDataArray[currentIndex].bold = true;
    }

    getRadio(mainDiagram.selection.Ca.value);
}

// ***************************************
// Chnage Text to Italic
// ***************************************
function changetextitalic() {
    var currentIndex = findCurrentIndex(tempKey);
    if (mainDiagram.model.nodeDataArray[currentIndex].Italic) {
        mainDiagram.model.nodeDataArray[currentIndex].Italic = false
    }
    else {
        mainDiagram.model.nodeDataArray[currentIndex].Italic = true;
    }
    getRadio(mainDiagram.selection.Ca.value);
}

// ***************************************
// Chnage Text to UnderLine
// ***************************************
function changetextunderline() {
    var currentIndex = findCurrentIndex(tempKey);
    if (mainDiagram.model.nodeDataArray[currentIndex].isUnderline) {
        mainDiagram.model.nodeDataArray[currentIndex].isUnderline = false
        document.getElementById("underline").style.backgroundColor = "white"
    }
    else {
        mainDiagram.model.nodeDataArray[currentIndex].isUnderline = true;
        document.getElementById("underline").style.backgroundColor = "#ff8c00"
    }
    mainDiagram.rebuildParts();
}

// ***************************************
// Chnage Text to StrikeThrough
// ***************************************
function changetextstrikethrough() {
    var currentIndex = findCurrentIndex(tempKey);
    if (mainDiagram.model.nodeDataArray[currentIndex].isStrikethrough) {
        mainDiagram.model.nodeDataArray[currentIndex].isStrikethrough = false
        document.getElementById("strikethrough").style.backgroundColor = "white"
    }
    else {
        mainDiagram.model.nodeDataArray[currentIndex].isStrikethrough = true;
        document.getElementById("strikethrough").style.backgroundColor = "#ff8c00"
    }
    mainDiagram.rebuildParts();
}

// ***************************************
// Set Default Number for Text Size
// ***************************************
function clicktextsize() {
    var fontsize = "";
    document.getElementById("fontsize").value = fontsize;
}

// ***************************************
// Chnage Text to Italic
// ***************************************
function changetextsize() {
    var currentIndex = findCurrentIndex(tempKey);
    var fontsize = document.getElementById("fontsize").value;
    mainDiagram.model.nodeDataArray[currentIndex].fontsize = fontsize;
    getRadio(mainDiagram.selection.Ca.value);
}

// ***************************************
// Set Default Text Style
// ***************************************
function clicktextstyle() {
    var fontstyle = "";
    document.getElementById("fontstyle").value = fontstyle;
}

// ***************************************
// Change Text Style
// ***************************************
function changetextstyle() {
    var currentIndex = findCurrentIndex(tempKey);
    var fontstyle = document.getElementById("fontstyle").value;
    mainDiagram.model.nodeDataArray[currentIndex].fontstyle = fontstyle;
    getRadio(mainDiagram.selection.Ca.value);
}

// ***************************************
// Chnage Text Color
// ***************************************
function changetextColor(stroke) {
    var currentIndex = findCurrentIndex(tempKey);
    mainDiagram.model.nodeDataArray[currentIndex].stroke = stroke.value;
    mainDiagram.rebuildParts();
    return;
}

function disableDeleteBtnOnKeybored(e) {
    var e = mainDiagram.lastInput;
    if (e.key == "Del") return;
    if (e.ur.keyCode == 17) return;
    return;
}