﻿var goObject = go.GraphObject.make;
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

    mainDiagram.linkTemplate = generateParentLinkTemplate();
    mainDiagram.linkTemplateMap.add(
        "ChildrenLink",
        generateChildLinkTemplate()
    )
    mainDiagram.model = logicModelToGoModel(logicModel);

    mainDiagram.commandHandler.selectAll = false;
    mainDiagram.toolManager.dragSelectingTool.isEnabled = false;
    mainDiagram.commandHandler.doKeyDown = disableDeleteBtnOnKeybored
    myDiagram.doFocu = disableHTMLAutoFocusCanvasToMiddle

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