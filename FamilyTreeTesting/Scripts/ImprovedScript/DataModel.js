var goObject = go.GraphObject.make;
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
        gotAdopted: false,
        notes: ["", "", ""],
        canBeDeleted: true
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

    globalLogicData = {
        parentTree: {
            left: dad,
            right: mom,
            marriageStatus: "married"
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
function findNode(id, logicData) {
    var resultNode = null;
    resultNode = searchParentTreeForNode(logicData.parentTree, id);
    if (resultNode === null) {
        resultNode = searchChildTreeForNode(logicData.childrenList,id);
    }
    return resultNode;
}

function searchParentTreeForNode(currentBranchNode, inputId) {
     var resultNode = null;
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

function searchChildTreeForNode(childrenList, inputId) {
    var resultNode = null;
    childrenList.forEach((child) => {
        if (child.parentTree) {
            var tempNode = findNode(inputId, child);
            if (tempNode != null) {
                resultNode = tempNode;
            }
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

function searchNodeCurrentArray(childrenList, inputId) {
    var result = {
        childrenList: null,
        index: -1
    }
    childrenList.forEach(function(child,index){
        if (child.id === inputId) {
            result.childrenList = childrenList;
            result.index = index;
            return result;
        } else if (child.parentTree && child.childrenList && result.index < 0) {
            if(child.parentTree.left.id === inputId || child.parentTree.right.id === inputId) {
                result.childrenList = childrenList;
                result.index = index;
                return result;
            } else {
                var subResult = searchNodeCurrentArray(child.childrenList, inputId);
                if (subResult.index >= 0) {
                    result = subResult;
                }
            }
        }
    })
    return result;
}

// only CommentBox use this function
function findCurrentIndex(inputKey) {
    var tempIndex;
    (mainDiagram.model.nodeDataArray).forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;

}

//***********************************************
// Generate go data model from logic data model
//***********************************************
function logicModelToGoModel(logicData, additionalNodeData) {
    var initialPosition = { x: 0, y: 0 };
    var renderData = logicDataToRenderData(logicData, initialPosition);
    return renderDataToGoModel(renderData, additionalNodeData);
}

function renderDataToGoModel(renderData, additionalNodeData) {
    var tempNodeArray;
    var model = goObject(go.GraphLinksModel,
        // Supporting link from line to line
        { linkLabelKeysProperty: "labelKeys" }
    );
    // Supporting port on main nodes
    model.linkFromPortIdProperty = "fromPort"
    model.linkToPortIdProperty = "toPort"

    // Apply offset based on Render Template
    tempNodeArray = renderData.nodeArray.map((item) => {
        if (item.category) {
            return item;
        } else {
            return applyOffSet(item, getMainShapeOffSet());
        }
    });

    if (additionalNodeData) {
        model.nodeDataArray = tempNodeArray.concat(additionalNodeData);
    } else {
        model.nodeDataArray = tempNodeArray;
    }

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