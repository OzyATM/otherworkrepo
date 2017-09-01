var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var globalDataModel;

//*********************************************
// Data Model initialization
//*********************************************
function initializeDataModel() {
    globalDataModel = {};

    globalDataModel.linkFromPortIdProperty = "fromPort";
    globalDataModel.linkToPortIdProperty = "toPort";
    globalDataModel.linkLabelKeysProperty = "labelKeys";

    globalDataModel.nodeArray = [
        {
            key: "1",
            gender: "female",
            isPatient: false,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            textForMultiIndividual: "",
            isMultiIndividualVisable: false,
            deadSymbolVisible: false,
            noteOne: "",
            noteTwo: "",
            noteThree: "",
            loc: "-50 0",
            isAdoptedSignVisible: false
        },
        {
            key: "2",
            gender: "male",
            isPatient: false,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            textForMultiIndividual: "",
            isMultiIndividualVisable: false,
            deadSymbolVisible: false,
            noteOne: "",
            noteTwo: "",
            noteThree: "",
            loc: "50 0",
            isAdoptedSignVisible: false
        },
        {
            key: "3",
            gender: "male",
            isPatient: true,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            textForMultiIndividual: "",
            isMultiIndividualVisable: false,
            deadSymbolVisible: false,
            noteOne: "",
            noteTwo: "",
            noteThree: "",
            loc: "0 100",
            isAdoptedSignVisible: false
        },
        {
            key: "1-2",
            category: "LinkLabel",
        },
    ];

    globalDataModel.linkArray = [
        { from: "1", fromPort: "R", to: "2", toPort: "L", labelKeys: ["1-2"] },
        { from: "1-2", to: "3", toPort: "T", category: "ChildrenLink"}
    ];
    return globalDataModel;
}

//***********************************************
// Generate go data model from our own data model
//***********************************************
function generateGoModel(inputModel) {
    var model = goObject(go.GraphLinksModel,
        // Supporting link from line to line
        { linkLabelKeysProperty: inputModel.linkLabelKeysProperty }
    );
    // Supporting port on main nodes
    model.linkFromPortIdProperty = inputModel.linkFromPortIdProperty
    model.linkToPortIdProperty = inputModel.linkToPortIdProperty
    model.nodeDataArray = inputModel.nodeArray.slice(0);
    model.linkDataArray = inputModel.linkArray.slice(0);
    return model;
}

//*********************************************
// Helper functions
//*********************************************
function findCurrentIndex(inputKey) {
    globalDataModel.nodeArray.forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
}