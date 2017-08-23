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
        "Spot",
        goObject(
            go.Shape,
            "Square",
            {
                height: 50,
                width: 50,
                fill: null,
                stroke: "blue",
                strokeWidth: 3
            }
        ),
        goObject(go.Placeholder), // make sure the admornment's position will not at a weird place
        goObject(
            go.Panel,
            "Horizontal",
            {
                alignment: go.Spot.Bottom,
                alignmentFocus: go.Spot.Top
            },
            createDeleteBtn(deleteNode, "刪除", 50)
        ),
        goObject(
            go.Panel,
            "Vertical",
            {
                alignment: go.Spot.Right,
                alignmentFocus: go.Spot.Left
            },
            createBtn(null, "換性別", null, null),
            createBtn(null, "父　母", null, null),
            createBtn(null, "配　偶", null, null),
            goObject(
                go.Panel,
                "Horizontal",
                createBtn(null, "兄", null, 32),
                createBtn(null, "弟", null, 32)
            ),
            goObject(
                go.Panel,
                "Horizontal",
                createBtn(null, "姊", null, 32),
                createBtn(null, "妹", null, 32)
            ),
            goObject(
                go.Panel,
                "Horizontal",
                createBtn(null, "兒", null, 32),
                createBtn(null, "女", null, 32)
            )
        ),
        goObject(
            go.Panel,
            "Vertical",
            {
                alignment: go.Spot.Left,
                alignmentFocus: go.Spot.Right
            },
            createBtn(null, "相同疾病", "#FFBD9D", 80),
            createBtn(null, "帶基因者", "#FFBD9D", 80),
            createBtn(null, "懷   孕", "#FFBD9D", 80),
            createBtn(null, "多個體", "#FFBD9D", 80),
            createBtn(null, "死   亡", "#FFBD9D", 80),
            createBtn(null, "註   解", "#FFBD9D", 80)
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

function createBtn(event, btnText, btnColor, width) {
    var inputEvent = event
    var inputText = btnText
    var inputBtnColor = "#B8B8DC";
    var inputWidth = 70;
    if (btnColor != null)
        inputBtnColor = btnColor
    if (width != null)
        inputWidth = width

    var createdBtn =
        goObject(
            "Button",
            {
                margin: 2.5,
                width: inputWidth,
                height: 30,
                "ButtonBorder.fill": inputBtnColor,
                "ButtonBorder.stroke": null,
                "ButtonBorder.figure": "RoundedRectangle",
                "_buttonFillOver": inputBtnColor,
                "_buttonStrokeOver": null,
                click: inputEvent
            },
            goObject(
                go.TextBlock,
                inputText,
                { font: "bold 10pt sans-serif" }
            )
        )
    return createdBtn
}