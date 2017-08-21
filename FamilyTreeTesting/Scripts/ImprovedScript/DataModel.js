var goObject = go.GraphObject.make;
// Initialize an empty datamodel
var dataModel = {};

//*********************************************
// Data Model initialization
//*********************************************
function initializeDataModel() {
    dataModel.nodeArray = [
        {
            key: "1",
            figure: "Circle"
        },
        {
            key: "2",
            figure: "Circle"
        },
        {
            key: "3",
            figure: "Square"
        },
        {
            key: "4",
            figure: "Square"
        }
    ];

    dataModel.linkArray = [
        {
            from: "1", to: "2"
        }
    ];
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
    dataModel.nodeArray.forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
}