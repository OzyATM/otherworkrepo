//*********************************************
// Generate Main Link Template
//*********************************************
function generateParentLinkTemplate() {
    var tempLinkTemplate;
    tempLinkTemplate = goObject(
        "Link",
        {
            relinkableFrom: false,
            relinkableTo: false
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
        "Link",
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
                layerName: "Foreground"
            },
            goObject(
                "Shape",
                "Ellipse",
                {
                    width: 7,
                    height: 7,
                    stroke: null,
                    portId: ""
                }
            )
        );
    return linkLabelTemplate;
}