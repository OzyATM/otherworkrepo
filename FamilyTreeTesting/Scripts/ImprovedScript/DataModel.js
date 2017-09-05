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
        canBeDeleted: true
    }
    return tempStorageTemplate;
}

function initializeGlobalLogicData() {
    globalLogicData = {};

    var dad = getDefaultLogicUnitData("A100", "male");
    dad.canBeDeleted = false;
    var daddad = getDefaultLogicUnitData("A100", "male");
    var dadmom = getDefaultLogicUnitData("A100", "female");

    dad.left = daddad;
    dad.right = dadmom;

    var mom = getDefaultLogicUnitData("A200", "female");
    mom.canBeDeleted = false;
    var momdad = getDefaultLogicUnitData("A100", "male");
    var mommom = getDefaultLogicUnitData("A100", "female");

    mom.left = momdad;
    mom.right = mommom;

    var patient = getDefaultLogicUnitData("B100", "male");
    patient.isPatient = true;
    patient.canBeDeleted = false;

    var sister1 = getDefaultLogicUnitData("B200", "female");
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