var goObject = go.GraphObject.make;
// Initialize an empty datamodel

//*********************************************
// Data Model initialization
//*********************************************
function initializeDataModel() {
    var dataModel = {};
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
    return dataModel;
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
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
}