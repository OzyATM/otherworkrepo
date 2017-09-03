var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var globalRenderData;
var globalLogicData;

function getDefaultLogitUnitData(inputId) {
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
    var dad = getDefaultLogitUnitData("A100");
    dad.gender = "male";
    var mom = getDefaultLogitUnitData("A200");
    mom.gender = "female";
    var patient = getDefaultLogitUnitData("B100");
    patient.gender = "male";
    patient.isPatient = true;
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

function logicDataToRenderData(logicData) {
    var baseDistance = 100;
    var baseHeight = 100;
    var basePosition = { x: 0, y: 0 };
    var result = { nodeArray: [], linkArray: [] };
    var parentTreeRenderData = getParentRenderData(basePosition, baseDistance, logicData.parentTree);
    result.nodeArray = result.nodeArray.concat(parentTreeRenderData.nodeArray);
    result.linkArray = result.linkArray.concat(parentTreeRenderData.linkArray);
    // var childrenTreeNodes = generateChildrenTreeNodes(basePosition, distance, parentTreeRenderData.linkNode, input.childrenList);
    return result;
}

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
        childLinkNode: ""
    };

    result.nodeArray.push(getNodeData(logicData.left, leftPos));
    result.nodeArray.push(getNodeData(logicData.right, rightPos));
    var linkData = getPartenerLinkData(logicData.left, logicData.right);
    result.nodeArray = result.nodeArray.concat(linkData.nodeArray);
    result.linkArray = result.linkArray.concat(linkData.linkArray);
    result.linkNode = linkData.linkNode;

    return result;
}

// *******************************************************
//      Logic to Render data conversion
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
//  - isPragment
//  - multiInvididualText
//  - isDead
//  - isAdopted
//  - notes (array)

function getPartenerLinkData(left, right) {
    var result = {
        nodeArray: [],
        linkArray: [],
        linkName: ""
    };

    result.linkName = "" + left.id + "-" + right.id, // combine left and right id to make a readble id

    result.nodeArray.push(
        {
            key: result.linkName,
            category: "LinkLabel",
        });
    result.linkArray.push(
        {
            from: left.id,
            fromPort: "R",
            to: right.id,
            toPort: "L",
            labelKeys: result.linkName
        }
    )
    return result;
}

function getNodeData(inputData, pos) {
    // Make sure no pointers is used in this method
    var tempNode = {
        key: inputData.id,
        mainFigure: getGenderShape(inputData.gender),
        isPatient: inputData.isPatient,
        fill: getSameDiseaseNodeFill(inputData.hasSameDisease),
        containGenVisible: inputData.containGen,
        isPVisable: inputData.isPragment,
        colorForP: getPregantTextColor(inputData.hasSameDisease, inputData.containGen),
        textForMultiIndividual: inputData.multiInvididualText,
        isMultiIndividualVisable: getMultiTextVisibility(inputData.multiInvididualText),
        deadSymbolVisible: inputData.isDead,
        noteOne: inputData.notes[0],
        noteTwo: inputData.notes[1],
        noteThree: inputData.notes[2],
        isAdoptedSignVisible: inputData.isAdopted,
        loc: getPosString(pos),
    }
    return tempNode;
}

function getPosString(pos) {
    return "" + pos.x + " " + pos.y;
}

function getGenderShape(gender) {
    if (gender === "male") {
        return "Square";
    } else if (gender === "female") {
        return "circle";
    } else if (gender === "unknown") {
        return "Diamond"
    } else if (gender === "baby") {
        return "Triangle"
    }
}

function getSameDiseaseNodeFill(sameDisease){
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

//***********************************************
// Generate go data model from logic data model
//***********************************************
function logicModelToGoModel(logicData) {
    var renderData = logicDataToRenderData(logicData);
    var model = goObject(go.GraphLinksModel,
        // Supporting link from line to line
        { linkLabelKeysProperty: "labelKeys" }
    );
    // Supporting port on main nodes
    model.linkFromPortIdProperty = "fromPort"
    model.linkToPortIdProperty = "toPort"
    model.nodeDataArray = renderData.nodeArray;
    model.linkDataArray = renderData.linkArray;
    return model;
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