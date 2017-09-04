var goObject = go.GraphObject.make;
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
