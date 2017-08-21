var goObject = go.GraphObject.make;
var mainDiagram

//*********************************************
// Graph initialization
//*********************************************
function initializeDiagram() {
    // Initialize Our DataModel, in the future, support load from file
    var initialDataModel = initializeDataModel();
    mainDiagram = goObject(
        go.Diagram, // go Type
        "mainDiagramDiv", // div id
        { // main setting, API detail and default at https://gojs.net/latest/api/symbols/Diagram.html
            initialContentAlignment: go.Spot.Center,
            "undoManager.isEnabled": false
        }
    )
    mainDiagram.nodeTemplate = generateNodeTemplate();
    mainDiagram.model = generateGoModel(initialDataModel);
}