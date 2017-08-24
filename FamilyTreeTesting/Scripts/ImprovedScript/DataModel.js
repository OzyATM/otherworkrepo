var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var globalDataModel;

//*********************************************
// Data Model initialization
//*********************************************
function initializeDataModel() {
    globalDataModel = {};
    globalDataModel.nodeArray = [
        {
            key: "1",
            figure: "circle",
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false
        },
        {
            key: "2",
            figure: "circle",
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false
        },
        {
            key: "3",
            figure: "square",
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false
        },
        {
            key: "4",
            figure: "square",
            fill: "transparent",
            isPVisable: false,
            colorForP: "white",
            deadSymbolVisible: false
        }
    ];

    globalDataModel.linkArray = [
        {
            from: "1", to: "2"
        }
    ];
    return globalDataModel;
}

//***********************************************
// Generate go data model from our own data model
//***********************************************
function generateGoModel(inputModel) {
    var model = goObject(go.GraphLinksModel);
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