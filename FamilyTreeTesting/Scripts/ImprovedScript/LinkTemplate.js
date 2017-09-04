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
                new go.Binding("height"),
            ),
            createPort("M", new go.Point(0, 0)),
        );
    return linkPointTemplate
}