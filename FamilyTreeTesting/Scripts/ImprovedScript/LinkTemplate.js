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
                strokeWidth: 2
            }
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
                stroke: "blue",
                strokeWidth: 2
            }
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
                "Ellipse",
                {
                    width: 3,
                    height: 3,
                    stroke: "black",
                    fill: "transparent",
                    portId: ""
                }
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
                selectable: true,
                layerName: "Foreground"
            },
            new go.Binding("location", "loc", go.Point.parse),
            goObject(
                go.Shape,
                "Ellipse",
                {
                    width: 2,
                    height: 2,
                    stroke: "blue",
                    fill: "blue"
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
        createBtn(null, "結婚", null, 50),
        createBtn(null, "離婚", null, 50)                                                                                                                                                                                                                              ,
        createBtn(null, "未婚", null, 50)
    )
    return tempHorizontalPanel;
}