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
    );
    mainDiagram.nodeTemplateMap.add(
        "LinkPoint",
        generateLinkPointTemplate()
    );

    mainDiagram.nodeTemplateMap.add(
        "careMale",
        generateCareTaker("male")
    );
    mainDiagram.nodeTemplateMap.add(
        "careFemale",
        generateCareTaker("female")
        );

    mainDiagram.linkTemplate = generateParentLinkTemplate();
    mainDiagram.linkTemplateMap.add(
        "ChildrenLink",
        generateChildLinkTemplate()
    )
    mainDiagram.model = logicModelToGoModel(logicModel);
    btnRegistration();
    createStuffOnNaviBar();
}

function reRender(key) {
    mainDiagram.model = logicModelToGoModel(globalLogicData);
    if (key) {
        var node = mainDiagram.findNodeForKey(key);
        if (node !== null) node.isSelected = true;
    }
}