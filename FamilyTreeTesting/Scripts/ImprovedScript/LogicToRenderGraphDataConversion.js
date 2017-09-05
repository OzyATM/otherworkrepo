var goObject = go.GraphObject.make;
// ************************************************
// Logic to render data structure conversion
// Render Parent and Child
// ************************************************

function logicDataToRenderData(logicData) {
    var baseChildHeight = 50;

    var baseParentDistance = 100;
    var baseParentHeight = 70;

    var basePosition = { x: 0, y: 0 };
    var result = { nodeArray: [], linkArray: [] };

    var parentTreeRenderData =
        getParentTreeRenderData(
            basePosition,
            baseParentDistance,
            baseParentHeight,
            logicData.parentTree
        );

    var childrenTreeRenderData =
        getChildrenRenderData(
            basePosition,
            baseChildHeight,
            parentTreeRenderData.linkNode,
            logicData.childrenList
        );

    result.nodeArray = result.nodeArray.concat(parentTreeRenderData.nodeArray);
    result.linkArray = result.linkArray.concat(parentTreeRenderData.linkArray);
    result.nodeArray = result.nodeArray.concat(childrenTreeRenderData.nodeArray);
    result.linkArray = result.linkArray.concat(childrenTreeRenderData.linkArray);

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
    return result;
}

function generateEmptyRenderData() {
    return { nodeArray: [], linkArray: [], linkNode: {} };
}

// *****************************************************
// Parent Tree Rendering

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
        var leftLink = {
            from: leftLinkNode.key,
            fromPort: "B",
            to: leftPNode.key,
            toPort: "T",
            category: "ChildrenLink",
            childKey: leftPNode.key
        }
        result.linkArray.push(leftLink);
    }

    var rightPNode = getNodeData(logicData.right, rightPos);
    if (rightLinkNode && rightLinkNode.key) {
        var leftLink = {
            from: rightLinkNode.key,
            fromPort: "B",
            to: rightPNode.key,
            toPort: "T",
            category: "ChildrenLink",
            childKey: rightPNode.key
        }
        result.linkArray.push(leftLink);
    }

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
