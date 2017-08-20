var goObject = go.GraphObject.make;

var mainDiagram

var model = goObject(go.GraphLinksModel);

model.nodeDataArray = [
    {
        key: "Something"
    },
    {
        key: "Something else"
    },
    {
        key: "Ok"
    }
]

model.linkDataArray = [
    {
        from: "Something", to: "Something else"
    }
]

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
            text: "Alpha",
            margin: 5
        },
        new go.Binding("text", "Key")
    )
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