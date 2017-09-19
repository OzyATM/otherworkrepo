var goObject = go.GraphObject.make;
//*********************************************
// Generate Main Link Template
//*********************************************
function generateParentLinkTemplate() {
    var tempLinkTemplate;
    tempLinkTemplate = goObject(
        go.Link,
        {
            relinkableFrom: false,
            relinkableTo: false,
            selectionAdornmentTemplate: generateLinkAdornment()
        },
        goObject(
            "Shape",
            {
                stroke: "green",
                strokeWidth: 2,
                strokeDashArray: [0,0]
            },
            new go.Binding("strokeDashArray")
        )
    );
    return tempLinkTemplate
}

function generateChildLinkTemplate() {
    var tempLinkTemplate;
    tempLinkTemplate = goObject(
        go.Link,
        {
            relinkableFrom: false,
            relinkableTo: false
        },
        goObject(
            "Shape",
            {
                stroke: "black",
                strokeWidth: 3
            },
            new go.Binding("strokeDashArray")
        )
    );
    return tempLinkTemplate
}

//*********************************************
// Generate Link Label
//*********************************************
function generateLinkLabel() {
    var linkLabelTemplate =
        goObject(
            "Node",
            {
                selectable: false,
            },
            goObject(
                "Shape",
                {
                    figure: "Ellipse",
                    visible: false,
                    width: 5,
                    height: 20,
                    stroke: "black",
                    fill: "transparent",
                    portId: "",
                    angle: 45
                },
                new go.Binding("figure"),
                new go.Binding("visible")
            )
        );
    return linkLabelTemplate;
}

function generateLinkPointTemplate() {
    var linkPointTemplate =
        goObject(
            go.Node,
            "Position",
            {
                selectable: false,
                layerName: "Foreground"
            },
            new go.Binding("location", "loc", go.Point.parse),
            goObject(
                go.Shape,
                "Square",
                {
                    width: 2,
                    height: 2,
                    stroke: "black",
                    fill: "black"
                },
                new go.Binding("width"),
                new go.Binding("height")
            ),
            createPort("M", new go.Point(0, 0))
        );
    return linkPointTemplate
}

//*********************************************
// Adornment Definition for Link  
//*********************************************
function generateLinkAdornment() {
    var tempAdornment = goObject(
        go.Adornment,
        "Spot",
        goObject(go.Placeholder), // make sure the admornment's position will not at a weird place(according to API it should be inside a panel or a group)
        generateLinkAdornmentShape(),
        generateHorizontalPanelWithBtn()
    );
    return tempAdornment;
}

//*********************************************
// Link's Adornment's Shape and its Definition
//*********************************************
function generateLinkAdornmentShape() {
    var tempShapeForAdm = goObject(
        go.Shape,
        {
            height: 10,
            width: 50,
            fill: null,
            stroke: null,
            strokeWidth: 3,
        }
    )
    return tempShapeForAdm
}

//*********************************************
// Create a Horizontal Panel and Put MarrageStatus Btn 
//*********************************************
function generateHorizontalPanelWithBtn() {
    var tempHorizontalPanel = goObject(
        go.Panel,
        "Horizontal",
        {
            alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom
        },
        createBtn(EventHandler.changeMarriageStatusToMarriage, "結婚", null, 50),
        createBtn(EventHandler.changeMarriageStatusToDivorce, "離婚", null, 50),
        createBtn(EventHandler.changeMarriageStatusToUnmarriage, "未婚", null, 50)
    )
    return tempHorizontalPanel;
}