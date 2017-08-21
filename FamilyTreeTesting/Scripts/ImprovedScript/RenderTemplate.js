var goObject = go.GraphObject.make;
// *******************************************
// Static Definitions
// *******************************************


//*********************************************
// Main Node Template Definition
// Input Data Control:
// Main Shape
//     - figure: shape of main object
//*********************************************
function generateNodeTemplate() {
    var personNodeTemplate = goObject(
        go.Node,
        "Auto", // Alignment setting is not used, we manually set item position
        generateMainShape(),
        {
            selectionAdornmentTemplate: generateMainAdornment()
        }
    );
    return personNodeTemplate;
}


//*********************************************
// Main Shape Definition
// Input Data Control:
// - figure: shape of the main object
//*********************************************
function generateMainShape() {
    var tempShape = goObject(
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
    )
    return tempShape;
}

//*********************************************
// Adornment Definition
//*********************************************
function generateMainAdornment() {
    var tempAdornment = goObject(
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
    );
    return tempAdornment;
}

//*********************************************
// Create Button Definition
//*********************************************
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
