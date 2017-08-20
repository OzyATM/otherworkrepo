var goObject = go.GraphObject.make;

var mainDiagram

var model = goObject(go.GraphLinksModel);

model.nodeDataArray = [
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
]

model.linkDataArray = [
    {
        from: "1", to: "2"
    }
]


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
        goObject(go.Placeholder),
        goObject(
            go.Panel,
            "Auto",
            createDeleteBtn(deleteNode, "刪除", 50)
        )
    )


personNodeTemplate = goObject(
    go.Node,
    "Auto", // Alignment setting is not used, we manually set item position
    goObject(
        go.Shape,
        {
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
)

function createDeleteBtn(event, btnText, btnWidth) {
    var inputEvent = event;
    var inputText = btnText;
    var inputWidth = btnWidth;
    var deleteBtn =
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

function deleteNode(e, obj) {
    var node = obj.part.adornedPart;
    var nodeKey = node.data.key;
    var objIndex = findCurrentIndex(nodeKey)
    mainDiagram.model.removeNodeData(node.data)
    //mainDiagram.model.nodeDataArray.splice(objIndex, 1)
}

function findCurrentIndex(inputKey) {
    (mainDiagram.model.nodeDataArray).forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
} 




function initializeDiagram() {
    mainDiagram = goObject(
        go.Diagram, // go Type
        "mainDiagramDiv", // div id
        { // main setting, API detail and default at https://gojs.net/latest/api/symbols/Diagram.html
            initialContentAlignment: go.Spot.Center,
            "undoManager.isEnabled": false
        }
    )
    mainDiagram.nodeTemplate = personNodeTemplate;
    mainDiagram.model = model;
}






