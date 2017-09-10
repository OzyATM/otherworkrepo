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
        notes: ["", "", ""],
        canBeDeleted: true,
    }
    return tempStorageTemplate;
}

function initializeGlobalLogicData() {
    globalLogicData = {};

    var dad = getDefaultLogicUnitData("A100", "male");
    dad.canBeDeleted = false;
    var daddad = getDefaultLogicUnitData("A110", "male");
    var dadmom = getDefaultLogicUnitData("A120", "female");

    var daddaddad = getDefaultLogicUnitData("A111", "male");
    var daddadmom = getDefaultLogicUnitData("A112", "female");
    daddad.left = daddaddad;
    daddad.right = daddadmom;

    dad.left = daddad;
    dad.right = dadmom;

    var mom = getDefaultLogicUnitData("A200", "female");
    mom.canBeDeleted = false;
    var momdad = getDefaultLogicUnitData("A210", "male");
    var mommom = getDefaultLogicUnitData("A220", "female");

    mom.left = momdad;
    mom.right = mommom;

    // Patient Family
    var patient = getDefaultLogicUnitData("B100", "male");
    patient.isPatient = true;
    patient.canBeDeleted = false;
    var patientWife = getDefaultLogicUnitData("B101", "female");

    var childTwo = getDefaultLogicUnitData("C300", "female");
    var childTwoHusband = getDefaultLogicUnitData("C301", "male");
    var childTwoChildOne = getDefaultLogicUnitData("D100", "male");
    var childTwoChildTwo = getDefaultLogicUnitData("D200", "male");
    var childTwoChildThree = getDefaultLogicUnitData("D300", "male");
    var childTwoSubTree = {
        parentTree: {
            left: childTwoHusband,
            right: childTwo,
            linkNode: "right"
        },
        childrenList: [
            childTwoChildOne,
            childTwoChildTwo,
            childTwoChildThree,
        ]
    }

    var child3 = getDefaultLogicUnitData("C400", "female");
    var child4 = getDefaultLogicUnitData("C500", "male");

    var patientSubTree = {};
    patientSubTree = {
        parentTree: {
            left: patient,
            right: patientWife,
            linkNode: "left"
        },
        childrenList: [
            childTwoSubTree,
            child3,
            child4
        ]
    }

    var sister1 = getDefaultLogicUnitData("B200", "female");
    var sisterHusband = getDefaultLogicUnitData("B201", "male");
    var sisChild1 = getDefaultLogicUnitData("C600", "male");
    var sisChild2 = getDefaultLogicUnitData("C700", "female");
    var sisChild3 = getDefaultLogicUnitData("C800", "female");
    var sister1SubTree = {
        parentTree: {
            left: sisterHusband,
            right: sister1,
            linkNode: "right"
        },
        childrenList: [
            sisChild1,
            sisChild2,
            sisChild3
        ]
    }

    var sister2 = getDefaultLogicUnitData("B300", "female");

    globalLogicData = {
        parentTree: {
            left: dad,
            right: mom,
            relation: {
                marriageStatus: "married",
            }
        },
        childrenList: [
            sister1SubTree,
            patientSubTree,
            sister2,
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
            resultNode = findNode(inputId, child);
        } else if (child.id === inputId) {
            resultNode = child;
        }
    });
    return resultNode;
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