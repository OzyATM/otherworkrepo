var goObject = go.GraphObject.make;
// *******************************************************
//      Logic to Render data Unit Conversion
// *******************************************************
// Note: This part of the code handles converting logical
// data that is understandble by human into data that makes
// sense to our rendering engine, below are the current
// format of each model
// *******************************************************
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

function getNodeData(inputData, pos) {
    // Make sure no pointers is used in this method
    var tempNode = {
        key: inputData.id,
        mainFigure: getGenderShape(inputData.gender),
        isPatient: inputData.isPatient,
        fill: getSameDiseaseNodeFill(inputData.hasSameDisease),
        containGenVisible: inputData.containGen,
        isPVisable: inputData.isPragnent,
        colorForP: getPregantTextColor(inputData.hasSameDisease, inputData.containGen),
        textForMultiIndividual: inputData.multiInvididualText,
        isMultiIndividualVisable: getMultiTextVisibility(inputData.multiInvididualText),
        deadSymbolVisible: inputData.isDead,
        noteOne: inputData.notes[0],
        noteTwo: inputData.notes[1],
        noteThree: inputData.notes[2],
        isAdoptedSignVisible: getIsAdoptedSignVisible(inputData),
        loc: getPosString(pos),
        isDeleteBtnVisible: inputData.canBeDeleted,
        isAddParentBtnVisible: !getParentBtnVisibility(inputData),
        isPregnantBtnVisible: getPregantBtnVisibility(inputData.multiInvididualText, inputData.gender),
        isMultiInvididualTextBtnVisible: getMultiInvididualTextBtnVisibility(inputData.isPragnent, inputData.hasSameDisease, inputData.containGen), 
        isOwnSonVisible: getIsOwnSonBtnVisibility(inputData),
        isAdoptedBtnVisible: getIsAdoptedBtnVisibility(inputData),
        isGotAdoptedBtnVisible: getIsGotAdoptedBtnVisibility(inputData),
        isSameDiseaseBtnVisible: getSameDiseaseBtnVisibility(inputData.multiInvididualText),
        isContainGenBtnVisible: getContainGenBtnVisibility(inputData.multiInvididualText),
        isAddPartnerBtnVisible: getPartnerBtnVisibility(inputData),
        isAddChildBtnVisible: getChildBtnVisibility(inputData),
        isAddSiblingBtnVisible: getSiblingBtnVisibility(inputData)
    }
    return tempNode;
}

function getPosString(pos, offSet) {
    return "" + pos.x + " " + pos.y;
}

function getPosFromString(posString) {
    var res = posString.split(" ");
    var resX = Number(res[0]);
    var resY = Number(res[1]);
    return { x: resX, y: resY };
}

function getGenderShape(gender) {
    if (gender === "male") {
        return "Square";
    } else if (gender === "female") {
        return "Circle";
    } else if (gender === "unknown") {
        return "Diamond"
    } else if (gender === "baby") {
        return "Triangle"
    }
}

function getSameDiseaseNodeFill(sameDisease) {
    if (!sameDisease) {
        return "transparent"
    } else {
        return "black"
    }
}

function getPregantTextColor(sameDisease, containGen) {
    if (sameDisease || containGen) {
        return "white";
    } else {
        return "black";
    }
}

function getMultiTextVisibility(multiText) {
    if (multiText === "") {
        return false;
    } else {
        return true;
    }
}

function getParentBtnVisibility(inputData) {
    var hasParent = getHasParent(inputData.id)
    if (inputData.left || inputData.right || hasParent)
        return true;
    else
        return false;
}

function getPregantBtnVisibility(multiText, gender) {
    if (multiText != "" || gender === "male") {
        return false;
    }
    else {
        return true;
    }
}

function getMultiInvididualTextBtnVisibility(isPragnent) {
    if (isPragnent) {
        return false;
    } else {
        return true;
    }
}

function getIsAdoptedSignVisible(inputData) {
    if (inputData.isAdopted || inputData.gotAdopted) {
        return true
    } else {
        return false
    }
}

function getIsOwnSonBtnVisibility(inputData) {
    if (!inputData.isAdopted && !inputData.gotAdopted) {
        return false;
    } else if (inputData.isAdopted || inputData.gotAdopted) {
        return true;
    }
}

function getIsAdoptedBtnVisibility(inputData) {
    var isPartner = getIsPartner(inputData)
    if (!inputData.isAdopted && !isPartner) {
        return true;
    } else if (isPartner) {
        return false;
    } else {
        return false;
    }
}

function getIsGotAdoptedBtnVisibility(inputData) {
    var isPartner = getIsPartner(inputData)
    if (!inputData.gotAdopted && !isPartner) {
        return true;
    } else if (isPartner) {
        return false;
    } else {
        return false;
    }
}

function getIsPartner(inputData) {
    var resultNode = null;
    var isPartnerChecker = false;
    var resultNode = searchParentTreeForNode(globalLogicData.parentTree, inputData.id);

    if (resultNode === null) {
        var nodeCurrentArrayDate = searchNodeCurrentArray(globalLogicData.childrenList, inputData.id);
        var nodeCurrentChildList = nodeCurrentArrayDate.childrenList;
        var nodeCurrentIndex = nodeCurrentArrayDate.index;
        if (nodeCurrentChildList[nodeCurrentIndex].parentTree) {
            var linkNodePosition = nodeCurrentChildList[nodeCurrentIndex].parentTree.linkNode;
            var leftNodeId = nodeCurrentChildList[nodeCurrentIndex].parentTree.left.id;
            var rightNodeId = nodeCurrentChildList[nodeCurrentIndex].parentTree.right.id;
            if (linkNodePosition === "left" && inputData.id === rightNodeId) {
                isPartnerChecker = true;
            } else if (linkNodePosition === "right" && inputData.id === leftNodeId) {
                isPartnerChecker = true;
            }
            return isPartnerChecker;
        }
    } else {
        return isPartnerChecker;
    }
}

function getPartnerBtnVisibility(inputData) {
    // check if the node is on the upper part or not, if it is on the upper part hide the add partner button
    var isOnUpperPart = getNodeIsOnUpperPart(inputData.id)
    var hasUnderPartner = findUnderPartnerExist(inputData)

    if (isOnUpperPart || hasUnderPartner)
        return false;
    else
        return true;
}

function getNodeIsOnUpperPart(id) {
    var resultNode = null;
    var isUpperPart = false;
    resultNode = searchParentTreeForNode(globalLogicData.parentTree, id);
    if (resultNode != null) {
        isUpperPart = true
    }
    return isUpperPart;
}

function findUnderPartnerExist(inputData) {
    var previousNode = null
    previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, inputData.id)
    if (previousNode === null) {
        var currentNodeArrayData = searchNodeCurrentArray(globalLogicData.childrenList, inputData.id)
        var currentNodeArray = currentNodeArrayData.childrenList;
        var currentNodeIndex = currentNodeArrayData.index;
        var hasUnderPartner = false
        if (currentNodeArray[currentNodeIndex].childrenList) {
            hasUnderPartner = true
        }
        else {
            return hasUnderPartner
        }
    }
    return hasUnderPartner
}

function getSiblingBtnVisibility(inputData) {
    var previousNode = null
    previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, inputData.id)
    if (previousNode === null) {
        var ispartner = getIsPartner(inputData)
        if (ispartner) {
            return false
        }
        else {
            return true
        }
    }
    else {
        return false;
    }
}

function getChildBtnVisibility(inputData) {
    resultNode = searchChildTreeForNode(globalLogicData.childrenList, inputData.id);
    if (resultNode == null) {
        return false
    }
    else {
        return true
    }
}

function getHasParent(id) {
    var hasParent = false;
    var previousNode = null
    previousNode = searchParentTreeNodePreviousNode(globalLogicData.parentTree, id)
    if (previousNode === null) {
        if ((id.childrenList === undefined) || (id = "B100")) {
            hasParent = true;
        }
    }
    return hasParent;
}

function getSameDiseaseBtnVisibility(multiText) {
    if (multiText != "") {
        return false;
    } else {
        return true;
    }
}
function getContainGenBtnVisibility(multiText) {
    if (multiText != "") {
        return false;
    } else {
        return true;
    }
}
