﻿var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var globalLogicData;

// *****************************************
// Get Templated Default data structure
//*********************************************
function getDefaultLogicUnitData(inputId, inputGender) {
    var tempStorageTemplate = {
        id: inputId,
        isPatient: false,
        gender: inputGender,
        hasSameDisease: false,
        containGen: false,
        isPragnent: false,
        multiInvididualText: "",
        isDead: false,
        isAdopted: false,
        notes: ["", "", ""],
        canBeDeleted: true,
    }
    return tempStorageTemplate;
}

function initializeGlobalLogicData() {
    globalLogicData = {};

    var dad = getDefaultLogicUnitData("A100", "male");
    dad.canBeDeleted = false;

    var mom = getDefaultLogicUnitData("A200", "female");
    mom.canBeDeleted = false;

    // Patient Family
    var patient = getDefaultLogicUnitData("B100", "male");
    patient.isPatient = true;
    patient.canBeDeleted = false;
    var patientWife = getDefaultLogicUnitData("B101", "female");

    globalLogicData = {
        parentTree: {
            left: dad,
            right: mom,
            relation: {
                marriageStatus: "married",
            }
        },
        childrenList: [
            patient
        ]
    }
    return globalLogicData;
}

//*********************************************
// Helper functions
//*********************************************
function findNode(id, logicData, resultNode) {
    if (!resultNode) {
        var resultNode = null;
    }
    resultNode = searchParentTreeForNode(logicData.parentTree, id, resultNode);
    if (resultNode === null) {
        resultNode = searchChildTreeForNode(logicData.childrenList,id, resultNode);
    }
    return resultNode;
}

function searchParentTreeForNode(currentBranchNode, inputId, resultNode) {
    if (!resultNode) {
        var resultNode = null;
    }
    if (currentBranchNode.id === inputId) {
        resultNode = currentBranchNode;
    }
    if (resultNode === null && currentBranchNode.left) {
        resultNode = searchParentTreeForNode(currentBranchNode.left, inputId);
    }
    if (resultNode === null && currentBranchNode.right) {
        resultNode = searchParentTreeForNode(currentBranchNode.right, inputId);
    }

    return resultNode;
}

function searchChildTreeForNode(childrenList, inputId ,resultNode) {
    if (!resultNode) {
        var resultNode = null;
    }
    childrenList.forEach((child) => {
        if (child.parentTree) {
            resultNode = findNode(inputId, child, resultNode);
        } else if (child.id === inputId) {
            resultNode = child;
        }
    });
    return resultNode;
}

function searchParentTreeNodePreviousNode(currentBranchNode, inputId) {
    var resultNode = null;
    if (currentBranchNode.left.id === inputId || currentBranchNode.right.id === inputId) {
        resultNode = currentBranchNode;
    }
    if (resultNode === null && currentBranchNode.left.left && currentBranchNode.left.right) {
        resultNode = searchParentTreeNodePreviousNode(currentBranchNode.left, inputId);
    }
    if (resultNode === null && currentBranchNode.right.left && currentBranchNode.right.right) {
        resultNode = searchParentTreeNodePreviousNode(currentBranchNode.right, inputId);
    }

    return resultNode;
}

function searchNodeCurrentArray(childrenList, inputId, resultListData) {
    // prevent resultListData set to default if it has data inside
    if (!resultListData){
        var resultListData = [];
    }
    childrenList.forEach(function(child,index){
        if (child.id === inputId){
            resultListData.push(childrenList);
            resultListData.push(index);
            return resultListData;
        } else if (child.parentTree && child.childrenList) {
            if(child.parentTree.left.id === inputId || child.parentTree.right.id === inputId) {
                resultListData.push(childrenList);
                resultListData.push(index);
                return resultListData;
            } else 
                searchNodeCurrentArray(child.childrenList, inputId ,resultListData);
        }
    })
    return resultListData;
}

//***********************************************
// Generate go data model from logic data model
//***********************************************
function logicModelToGoModel(logicData) {
    var initialPosition = { x: 0, y: 0 };
    var renderData = logicDataToRenderData(logicData, initialPosition);
    return renderDataToGoModel(renderData);
}

function renderDataToGoModel(renderData) {
    var model = goObject(go.GraphLinksModel,
        // Supporting link from line to line
        { linkLabelKeysProperty: "labelKeys" }
    );
    // Supporting port on main nodes
    model.linkFromPortIdProperty = "fromPort"
    model.linkToPortIdProperty = "toPort"

    // Apply offset based on Render Template
    model.nodeDataArray = renderData.nodeArray.map((item) => {
        if (item.category) {
            return item;
        } else {
            return applyOffSet(item, getMainShapeOffSet());
        }
    });

    model.linkDataArray = renderData.linkArray;
    return model;
}

function applyOffSet(renderData, offSet) {
    var resultPos = getPosFromString(renderData.loc);
    resultPos.x = resultPos.x + offSet.x;
    resultPos.y = resultPos.y + offSet.y;
    renderData.loc = getPosString(resultPos);
    return renderData;
}

function getMainShapeOffSet() {
    return { x: -30, y: -23 };
}
// ***********************************************
// Helper function to generate unique ID
// ***********************************************
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}