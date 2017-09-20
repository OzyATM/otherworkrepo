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
        "CareMale",
        generateCareTakerTemplate("male")
    );
    mainDiagram.nodeTemplateMap.add(
        "CareFemale",
        generateCareTakerTemplate("female")
    );
    mainDiagram.nodeTemplateMap.add(
        "FreehandDrawing",
        generateFreeDrawTemplate()
    )
    mainDiagram.nodeTemplateMap.add(
        "CommentBox",
        generateCommentBoxTemplate()
    )
    mainDiagram.addDiagramListener("ObjectSingleClicked",
        objectSingleClicked
    );

    mainDiagram.addDiagramListener("BackgroundSingleClicked",
        backGroundSingleClicked
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
    var savedJson = save();
    load(savedJson);
    if (key) {
        var node = mainDiagram.findNodeForKey(key);
        if (node !== null) node.isSelected = true;
    }
}

function save() {
    var modelJson = mainDiagram.model.toJson();
    var nodeData = JSON.parse(modelJson).nodeDataArray;
    var drawDataArray = [];
    nodeData.forEach((node) => {
        if (node.category === "FreehandDrawing") {
            drawDataArray.push(node);
        } else if (node.category === "CommentBox") {
            drawDataArray.push(node);
        } else if (node.category === "CareMale") {
            drawDataArray.push(node);
        } else if (node.category === "CareFemale") {
            drawDataArray.push(node);
        }
    });

    var save = {
        logicData: globalLogicData,
        drawData: drawDataArray,
        position: go.Point.stringify(mainDiagram.position)
    }
    return save;
}

function load(inputJson) {
    mainDiagram.model = logicModelToGoModel(inputJson.logicData, inputJson.drawData);
    mainDiagram.initialPosition = go.Point.parse(inputJson.position);
}