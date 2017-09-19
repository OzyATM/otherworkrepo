var goObject = go.GraphObject.make;

// ************************************************
// Global Base Setting
// ************************************************
var baseChildHeight = 50;
var baseParentDistance = 100;
var baseParentHeight = 70;
var baseChildGap = 100;
var childNodeSecondHeight = 40;

// ************************************************
// Logic to render data structure conversion
// Render Parent and Child
// ************************************************
function logicDataToRenderData(logicData, basePosition) {
    var result = generateEmptyRenderData();

    var parentTreeRenderData =
        getParentTreeRenderData(
            basePosition,
            baseParentDistance,
            baseParentHeight,
            logicData.parentTree
        );

    if (logicData.childrenList) {
        var childrenTreeRenderData =
            getChildrenRenderData(
                basePosition,
                baseChildHeight,
                parentTreeRenderData.linkNode,
                logicData.childrenList
            );
        result.nodeArray = result.nodeArray.concat(childrenTreeRenderData.nodeArray);
        result.linkArray = result.linkArray.concat(childrenTreeRenderData.linkArray);
    }

    result = mergeRenderData(result, parentTreeRenderData);
    return result;
}

function findLayer(layerControl) {
    if (!layerControl)
        return 0;
    let result = 1;
    let leftLayer = 0;
    let rightLayer = 0;
    if (layerControl.left)
        leftLayer = findLayer(layerControl.left);
    if (layerControl.right)
        rightLayer = findLayer(layerControl.right);
    result += Math.max(leftLayer, rightLayer);
    return result;
}

function mergeRenderData(baseData, mergeData) {
    var result = generateEmptyRenderData();
    result.nodeArray = baseData.nodeArray.concat(mergeData.nodeArray);
    result.linkArray = baseData.linkArray.concat(mergeData.linkArray);
    result.linkNode = mergeData.linkNode;
    result.linkParentNode = mergeData.linkParentNode;
    return result;
}

function generateEmptyRenderData() {
    return { nodeArray: [], linkArray: [], linkNode: {}, linkParentNode: {} };
}

// *****************************************************
// Parent Tree Rendering

function getParentTreeRequiredDistance(logicData) {
    let distModifier = Math.pow(2, findLayer(logicData) - 1); // minus 1: as childLayer counts as 1
    return baseParentDistance * distModifier;
}

function getParentTreeRenderData(basePos, distance, height, logicData) {
    let distModifier = Math.pow(2, findLayer(logicData) - 2); // minus 2: as 1 is child layer, 2 is current layer
    var result = getParentBranchRenderData(basePos, distance * distModifier, height, logicData);
    return result;
}

function getParentBranchRenderData(pos, distance, height, logicData) {
    var leftBranchData = generateEmptyRenderData();
    var rightBranchData = generateEmptyRenderData();
    var currentLayer = generateEmptyRenderData();
    if (logicData.left && logicData.right) {

        var leftPos = { x: pos.x - (distance / 2), y: pos.y - height };
        leftBranchData = getParentBranchRenderData(leftPos, (distance / 2), height, logicData.left);

        var rightPos = { x: pos.x + (distance / 2), y: pos.y - height };
        rightBranchData = getParentBranchRenderData(rightPos, (distance / 2), height, logicData.right);

        currentLayer = getParentNodeRenderData(pos, distance, logicData, leftBranchData.linkNode, rightBranchData.linkNode);
    }

    var result = mergeRenderData(leftBranchData, rightBranchData);
    result = mergeRenderData(result, currentLayer);
    return result;
}

function getParentNodeRenderData(pos, distance, logicData, leftLinkNode, rightLinkNode) {
    var strokeDashArrayStyle = [0,0]
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
    if (leftLinkNode && leftLinkNode.key) {
        if (logicData.left.isAdopted){
            strokeDashArrayStyle = [5,2];
        } else{
            strokeDashArrayStyle = [0,0];
        }
        var leftLink = {
            from: leftLinkNode.key,
            fromPort: "B",
            to: leftPNode.key,
            toPort: "T",
            category: "ChildrenLink",
            childKey: leftPNode.key,
            strokeDashArray: strokeDashArrayStyle
        }
        result.linkArray.push(leftLink);
    }

    var rightPNode = getNodeData(logicData.right, rightPos);
    if (rightLinkNode && rightLinkNode.key) {
        if (logicData.right.isAdopted){
            strokeDashArrayStyle = [5,2];
        } else {
            strokeDashArrayStyle = [0,0];
        }
        var rightLink = {
            from: rightLinkNode.key,
            fromPort: "B",
            to: rightPNode.key,
            toPort: "T",
            category: "ChildrenLink",
            childKey: rightPNode.key,
            strokeDashArray: strokeDashArrayStyle
        }
        result.linkArray.push(rightLink);
    }

    var linkData = getPartenerLinkData(leftPNode, rightPNode, logicData.marriageStatus);

    result.nodeArray.push(leftPNode);
    result.nodeArray.push(rightPNode);
    result.nodeArray = result.nodeArray.concat(linkData.nodeArray);
    result.linkArray = result.linkArray.concat(linkData.linkArray);
    result.linkNode = linkData.linkNode;
    if (logicData.linkNode === "left")
        result.linkParentNode = leftPNode;
    if (logicData.linkNode === "right")
        result.linkParentNode = rightPNode;

    return result;
}

function getPartenerLinkData(left, right, relationshipStatus) {
    var result = { nodeArray: [], linkArray: [], linkNode: {} };
    var strokeDashArrayStyle;
    result.linkName = "" + left.key + "-" + right.key; // combine left and right id to make a readble id

    if (relationshipStatus === "divorce") {
        result.linkNode = { key: result.linkName, category: "LinkLabel", visible: true, figure: "Capacitor"}
        result.nodeArray.push(result.linkNode);
        strokeDashArrayStyle = [0,0];
    } else if (relationshipStatus === "unmarried"){
        result.linkNode = { key: result.linkName, category: "LinkLabel" }
        result.nodeArray.push(result.linkNode);
        strokeDashArrayStyle = [5,2];
    } else if (relationshipStatus === "married"){
        result.linkNode = { key: result.linkName, category: "LinkLabel" }
        result.nodeArray.push(result.linkNode);
        strokeDashArrayStyle = [0,0];
    }

    result.linkArray.push(
        {
            from: left.key,
            fromPort: "R",
            to: right.key,
            toPort: "L",
            labelKeys: [result.linkName],
            strokeDashArray: strokeDashArrayStyle
        }
    )
    return result;
}

// *****************************************************
// Child Tree Rendering

function getChildrenRenderData(basePos, initialHeight, linkNode, logicData) {
    var result = generateEmptyRenderData();
    var lineLength = 0;
    var childGapList = getChildrenGapList(logicData);
    childGapList.forEach((item, index) => {
        lineLength += item;
    });
    lineLength -= 100; // Don't know why this works, but this fixed the line gap problem
    var initX = basePos.x - (lineLength / 2);
    var initY = basePos.y + initialHeight + childNodeSecondHeight;
    var lastPos = { x: initX, y: initY };
    logicData.forEach((item, index) => {
        var currentPos = { x: lastPos.x + childGapList[index], y: lastPos.y }
        var childRenderData = generateEmptyRenderData();
        if (item.parentTree) {
            childRenderData = getSubChildrenRenderData(item, currentPos, childGapList[index+1]);
            var linkData = getChildLinkData(childRenderData.linkParentNode, linkNode, basePos, initialHeight);
            childRenderData = mergeRenderData(linkData, childRenderData);
        } else {
            childRenderData = getSingleChildNode(item, currentPos, linkNode, basePos, initialHeight);
        }
        result = mergeRenderData(result, childRenderData);
        lastPos = currentPos;
    });

    return result;
}

// *****************************************************
// Child Node Rendering
function getSubChildrenRenderData(item, currentPos, currentGap) {
    var renderPos = { x: currentPos.x + ((currentGap - 100) / 2), y: currentPos.y };
    var renderData = logicDataToRenderData(item, renderPos);
    return renderData;
}

function getSingleChildNode(item, currentPos, linkNode, basePos, initialHeight) {
    result = generateEmptyRenderData();
    var childRenderNode = getNodeData(item, currentPos);
    var linkData = getChildLinkData(childRenderNode, linkNode, basePos, initialHeight);

    result.nodeArray.push(childRenderNode);
    result.nodeArray = result.nodeArray.concat(linkData.nodeArray);
    result.linkArray = result.linkArray.concat(linkData.linkArray);
    return result;
}


// *****************************************************
// Calculate Gap required for children

function getChildrenGapList(logicData) {
    var result = [];
    result.push(0); // No gap for the first element
    logicData.forEach((item, index) => {
        if (item.parentTree) {
            result.push(getRequiredNodeGap(item));
        } else {
            result.push(baseChildGap);
        }
    });
    return result;
}

function getRequiredNodeGap(item) {
    // as of right now, parent gap only works for single parent, fix this when there are multi parent support
    var parentGap = getParentTreeRequiredDistance(item.parentTree);
    var childrenGap = 0;
    if (item.childrenList) {
        var childrenGapList = getChildrenGapList(item.childrenList);
        childrenGapList.forEach((childGap, index) => {
            childrenGap += childGap;
        });
    }
    return parentGap > childrenGap ? parentGap : childrenGap;
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
