var goObject = go.GraphObject.make;

var mainDiagram

var model = goObject(go.GraphLinksModel);

model.nodeDataArray = [
    {
        key: "1",
        displayText: "Tony is Mean to me"
    },
    {
        key: "2",
        displayText: "So i am sad"
    },
    {
        key: "3",
        displayText: "i really miss the nice Tony"
    },
    {
        key: "4",
        displayText: "so yea...i hate him now =("
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
            createDeleteBtn(null, "刪除", 50)
        )
    )


personNodeTemplate = goObject( 
    go.Node,
    "Auto", // Alignment setting is not used, we manually set item position
    goObject(
        go.Shape,
        {
            figure: "RoundedRectangle",
            fill: "lightblue"
        }
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