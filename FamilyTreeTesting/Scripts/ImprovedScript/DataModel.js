var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var globalDataModel;

//*********************************************
// Data Model initialization
//*********************************************
function initializeDataModel() {
    globalDataModel = {};
    globalDataModel.linkFromPortIdProperty = "fromPort"
    globalDataModel.linkToPortIdProperty = "toPort"
    globalDataModel.nodeArray = [
        {
            key: "1",
            figure: "circle",
            isPatient: true,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false,
            noteOne: "1",
            noteTwo: "",
            noteThree: ""
        },
        {
            key: "2",
            figure: "circle",
            isPatient: false,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false,
            noteOne: "",
            noteTwo: "2",
            noteThree: ""
        },
        {
            key: "3",
            figure: "square",
            isPatient: false,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false,
            noteOne: "",
            noteTwo: "",
            noteThree: "3"
        },
        {
            key: "4",
            figure: "square",
            isPatient: false,
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false,
            noteOne: "1",
            noteTwo: "2",
            noteThree: "3"
        }
    ];

    globalDataModel.linkArray = [
        {
            from: "1", fromPort:"R", to: "2", toPort: "L" 
        }
    ];
    return globalDataModel;
}

//***********************************************
// Generate go data model from our own data model
//***********************************************
function generateGoModel(inputModel) {
    var model = goObject(go.GraphLinksModel);
    model.linkFromPortIdProperty = "fromPort"
    model.linkToPortIdProperty = "toPort"
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