var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var globalLogicData;

// *****************************************
// Get Templated Default data structure
//*********************************************
function getDefaultLogicUnitData(inputId) {
    var tempStorageTemplate = {
        id: inputId,
        isPatient: false,
        gender: "female",
        hasSameDisease: false,
        containGen: false,
        isPragment: false,
        multiInvididualText: "",
        isDead: false,
        isAdopted: false,
        notes: ["", "", ""]
    }
    return tempStorageTemplate;
}

function initializeGlobalLogicData() {
    globalLogicData = {};
    var dad = getDefaultLogicUnitData("A100");
    dad.gender = "male";
    var mom = getDefaultLogicUnitData("A200");
    mom.gender = "female";
    var patient = getDefaultLogicUnitData("B100");
    patient.gender = "male";
    patient.isPatient = true;

    var sister1 = getDefaultLogicUnitData("B200");
    sister1.gender = "female";
    sister1.isPragment = "true";

    var sister2 = getDefaultLogicUnitData("B300");
    sister2.gender = "female";
    sister2.isPragment = "true";

    globalLogicData = {
        parentTree: {
            left: dad,
            right: mom,
            relation: {
                marriageStatus: "married",
            }
        },
        childrenList: [
            patient,
            sister1,
            sister2
        ]
    }
    return globalLogicData;
}

//*********************************************
// Helper functions
//*********************************************
function findCurrentIndex(inputKey) {
    globalRenderData.nodeArray.forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
}

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
    for (i = 0; i < childrenList.length; i++) {
        var item = childrenList[i];
        if (item.id === inputId) {
            resultNode = item;
        }
    }
    return resultNode;
}

// ************************************************
// Logic to render data structure conversion
// Render Parent and Child
// ************************************************

function logicDataToRenderData(logicData) {
    var baseDistance = 100;
    var baseHeight = 50;
    var basePosition = { x: 0, y: 0 };
    var result = { nodeArray: [], linkArray: [] };

    var parentTreeRenderData =
        getParentRenderData(
            basePosition,
            baseDistance,
            logicData.parentTree
        );

    var childrenTreeRenderData =
        getChildrenRenderData(
            basePosition,
            baseHeight,
            parentTreeRenderData.linkNode,
            logicData.childrenList
        );

    result.nodeArray = result.nodeArray.concat(parentTreeRenderData.nodeArray);
    result.linkArray = result.linkArray.concat(parentTreeRenderData.linkArray);
    result.nodeArray = result.nodeArray.concat(childrenTreeRenderData.nodeArray);
    result.linkArray = result.linkArray.concat(childrenTreeRenderData.linkArray);

    return result;
}

// *****************************************************
// Parent Tree Rendering

function getParentRenderData(pos, distance, logicData) {
    var leftPos = {
        x: pos.x - (distance / 2),
        y: pos.y,
    };
    var rightPos = {
        x: pos.x + (distance / 2),
        y: pos.y
    };
    var result = {
        nodeArray: [],
        linkArray: [],
        linkNode: {}
    };

    var leftPNode = getNodeData(logicData.left, leftPos);
    var rightPNode = getNodeData(logicData.right, rightPos);
    var linkData = getPartenerLinkData(leftPNode, rightPNode);


    result.nodeArray.push(leftPNode);
    result.nodeArray.push(rightPNode);
    result.nodeArray = result.nodeArray.concat(linkData.nodeArray);
    result.linkArray = result.linkArray.concat(linkData.linkArray);
    result.linkNode = linkData.linkNode;

    return result;
}

function getPartenerLinkData(left, right) {
    var result = { nodeArray: [], linkArray: [], linkNode: {} };

    result.linkName = "" + left.key + "-" + right.key; // combine left and right id to make a readble id
    result.linkNode = { key: result.linkName, category: "LinkLabel" }
    result.nodeArray.push(result.linkNode);

    result.linkArray.push(
        {
            from: left.key,
            fromPort: "R",
            to: right.key,
            toPort: "L",
            labelKeys: [result.linkName]
        }
    )
    return result;
}

// *****************************************************
// Child Tree Rendering

function getChildrenRenderData(basePos, initialHeight, linkNode, logicData) {
    var childNodeSecondHeight = 40;
    var childGap = 100;
    var result = { nodeArray: [], linkArray: [] };

    var initX = 0 - (childGap * (logicData.length - 1) / 2);
    var initY = basePos.y + initialHeight + childNodeSecondHeight;

    logicData.forEach((item, index) => {
        var currentPos = { x: initX + index * childGap, y: initY }
        var childRenderNode = getNodeData(item, currentPos);
        var linkData = getChildLinkData(childRenderNode, linkNode, basePos, initialHeight);

        result.nodeArray.push(childRenderNode);
        result.nodeArray = result.nodeArray.concat(linkData.nodeArray);
        result.linkArray = result.linkArray.concat(linkData.linkArray);
    });

    return result;
}

function getChildLinkData(childNode, linkNode, basePos, initHeight) {
    var result = { nodeArray: [], linkArray: [], linkNode: {} };

    var mainDropPos = { x: basePos.x, y: basePos.y + initHeight };
    var subDropPos = { x: getPosFromString(childNode.loc).x, y: mainDropPos.y };
    var mainPosNode = {
        key: uuidv4(),
        loc: getPosString(mainDropPos),
        category: "LinkPoint"
    };
    var subPosNode = {
        key: uuidv4(),
        loc: getPosString(subDropPos),
        category: "LinkPoint"
    };

    var linkNodeToMainPosNodeLink = {
        from: linkNode.key,
        to: mainPosNode.key,
        category: "ChildrenLink",
        childKey: childNode.key
    }

    var mainPosNodeToSubPosNodeLink = {
        from: mainPosNode.key,
        to: subPosNode.key,
        category: "ChildrenLink",
        childKey: childNode.key
    }

    var subPosNodeToChildLink = {
        from: subPosNode.key,
        to: childNode.key,
        toPort: "T",
        category: "ChildrenLink",
        childKey: childNode.key
    }

    result.nodeArray.push(mainPosNode);
    result.nodeArray.push(subPosNode);
    result.linkArray.push(linkNodeToMainPosNodeLink);
    result.linkArray.push(mainPosNodeToSubPosNodeLink);
    result.linkArray.push(subPosNodeToChildLink);
    return result;
}



//***********************************************
// Generate go data model from logic data model
//***********************************************
function logicModelToGoModel(logicData) {
    var renderData = logicDataToRenderData(logicData);
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