var goObject = go.GraphObject.make;

var mainDiagram

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

function generateGoModel(inputModel) {
    var model = goObject(go.GraphLinksModel);
    model.nodeDataArray = inputModel.nodeArray.slice(0);
    model.linkDataArray = inputModel.linkArray.slice(0);
    return model;
}


//*********************************************
// Node Definition
//*********************************************

var adm =
    goObject(
        go.Adornment,
        "Auto",
        goObject(
            go.Shape,
            "Rectangle",
            {
                fill: null,
                stroke: "blue",
                strokeWidth: 3
            }
        ),
        goObject(
            go.Panel,
            "Auto",
            goObject(go.Placeholder)
        ),
        goObject(
            go.Panel,
            "Horizontal",
            {
                alignment: go.Spot.Bottom,
                alignmentFocus: go.Spot.Bottom
            },
            createDeleteBtn(deleteNode, "刪除", 50)
        )
    )

function getNodeTemplate(mainShape, adornment, text) {
    var personNodeTemplate = goObject(
        go.Node,
        "Auto", // Alignment setting is not used, we manually set item position
        goObject(
            go.Shape,
            {
                width: 30,
                height: 30,
                strokeWidth: 5,
                maxSize: new go.Size(40, 40),
                cursor: "pointer",
                fill: "white"
            },
            new go.Binding("figure")
        ),
        goObject(
            go.TextBlock,
            {
                margin: 5
            },
            new go.Binding("text", "displayText")
        ),
        {
            selectionAdornmentTemplate: adm
        }
    );
    return personNodeTemplate;
}

//*********************************************
// Graph initialization
//*********************************************
function initializeDiagram() {
    mainDiagram = goObject(
        go.Diagram, // go Type
        "mainDiagramDiv", // div id
        { // main setting, API detail and default at https://gojs.net/latest/api/symbols/Diagram.html
            initialContentAlignment: go.Spot.Center,
            "undoManager.isEnabled": false
        }
    )
    mainDiagram.nodeTemplate = getNodeTemplate();
    mainDiagram.model = generateGoModel(dataModel);
}

function createDeleteBtn(event, btnText, btnWidth) {
    var deleteBtn;
    var inputEvent = event;
    var inputText = btnText;
    var inputWidth = btnWidth;
    deleteBtn =
        goObject(
            "Button",
            {
                margin: 5,
                width: inputWidth,
                height: 30,
                "ButtonBorder.fill": "#FF2D2D",
                "ButtonBorder.stroke": null,
                "ButtonBorder.figure": "RoundedRectangle",
                "_buttonFillOver": "#FF2D2D",
                "_buttonStrokeOver": null,
                click: inputEvent
            },
            goObject(
                go.TextBlock,
                inputText,
                { font: "10pt sans-serif ", stroke: "white" }
            )
        )
    return deleteBtn
}

function deleteNode(e, object) {
    var node = object.part.adornedPart;
    var nodeKey = node.data.key;
    var objIndex = findCurrentIndex(nodeKey);
    dataModel.nodeArray.splice(objIndex, 1);
    mainDiagram.model = generateGoModel(dataModel);
}

function findCurrentIndex(inputKey) {
    dataModel.nodeArray.forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
}