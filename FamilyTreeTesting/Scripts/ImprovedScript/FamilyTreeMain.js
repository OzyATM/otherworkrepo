var goObject = go.GraphObject.make;
var mainDiagram

//*********************************************
// Graph initialization
//*********************************************
function initializeDiagram() {
    // Initialize Our DataModel, in the future, support load from file
    var logicModel = initializeGlobalLogicData();
    mainDiagram = goObject(
        go.Diagram, // go Type
        "mainDiagramDiv", // div id
        { // main setting, API detail and default at https://gojs.net/latest/api/symbols/Diagram.html
            initialContentAlignment: go.Spot.Center,
            "undoManager.isEnabled": false,
            "animationManager.isEnabled": false // disable the animation when redraw
        }
    )
    mainDiagram.nodeTemplate = generateNodeTemplate();
    mainDiagram.nodeTemplateMap.add(
        "LinkLabel",
        generateLinkLabel()
    )
    mainDiagram.linkTemplate = generateParentLinkTemplate();
    mainDiagram.linkTemplateMap.add(
        "ChildrenLink",
        generateChildLinkTemplate()
    )
    mainDiagram.model = logicModelToGoModel(logicModel);
    btnRegistration();
    createStuffOnNaviBar();
}