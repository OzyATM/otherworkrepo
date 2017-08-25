var goObject = go.GraphObject.make;
// *******************************************
// Static Definitions
// *******************************************


//*********************************************
// Main Node Template Definition
// Input Data Control:
// Main Shape
//     - figure: shape of main object
//     - fill: the shape's color
//*********************************************
function generateNodeTemplate() {
    var personNodeTemplate = goObject(
        go.Node,
        "Position", // Alignment setting is not used, we manually set item position
        generateSlashLineInAPanel(),
        generateMainShape(),
        {
            selectionAdornmentTemplate: generateMainAdornment()
        },
        generateContainGenCircle(),
        generatePTextBlock(),
        generateArrowPointToPatient()
    );
    return personNodeTemplate;
}


//*********************************************
// Main Shape Definition
// Input Data Control:
// - figure: shape of the main object
// - fill: the shape's color
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
            fill: "transparent"
        },
        new go.Binding("figure"),
        new go.Binding("fill")
    )     

    return tempShape;
}

//*********************************************
// Panel With Line2(slash line) Definition
// Input Data Control:
// - deadSymbolVisible: make the Line2 Visible or not
//*********************************************
function generateSlashLineInAPanel() {
    var tempPanel = goObject(
        go.Panel,
        {
            width: 45,
            height: 45,
        },
        goObject(
            go.Shape,
            "Line2",
            {
                width: 42,
                height: 42,
                stroke: "black",
                visible: false,
                strokeWidth: 3,
                //position: new go.Point(5, 5)
            },
            new go.Binding("visible", "deadSymbolVisible")
        )
    )
    return tempPanel
}

//*********************************************
// The circle for containGen Definition
// Input Data Control:
// - colorForContainGenCircle: the color of the circle for ceotainGen
// - containGenVisible: the circle's color
//*********************************************
function generateContainGenCircle() {
    var tempShape = goObject(
        go.Shape,
        "Circle",
        {
            width: 100,
            height: 100,
            stroke: null,
            maxSize: new go.Size(15, 15),
            fill: "white",
            visible: false,
            position: new go.Point(9, 9)
        },
        new go.Binding("fill", "colorForContainGenCircle"),
        new go.Binding("visible", "containGenVisible")
    )
    return tempShape
}

//*********************************************
// Textblock with char P Definition
// Input Data Control:
// - isPVisable: does the P visible
// - colorForP: color of the char P
//*********************************************
function generatePTextBlock(){
    var tempTextBlock = goObject(
        go.TextBlock,
        "P",
        {
            font: "10pt sans-serif",
            stroke: "white",
            visible: false,
            position: new go.Point(13, 11)
        },
        new go.Binding("visible", "isPVisable"),
        new go.Binding("stroke", "colorForP")
    )
    return tempTextBlock;
}

//*********************************************
// Textblock with arraow
//*********************************************
function generateArrowPointToPatient() {
    var tempTextBlock = goObject(
        go.TextBlock,
        "↗",
        {
            font: "10pt sans-serif ",
            stroke: "black",
            background: "lightblue", //backgrond is for debug use
            alignment: new go.Spot(1, 1, 0, 20)
        }
    )
    return tempTextBlock;
}

//*********************************************
// Adornment Definition
//*********************************************
function generateMainAdornment() {
    var tempAdornment = goObject(
        go.Adornment,
        "Position",
        goObject(
            go.Shape,
            "Square",
            {
                height: 50,
                width: 50,
                fill: null,
                stroke: "blue",
                strokeWidth: 3,
                position: new go.Point(-9, -9)
            }
        ),
        goObject(go.Placeholder), // make sure the admornment's position will not at a weird place(according to API it should be inside a panel or a group)
        goObject(
            go.Panel,
            "Horizontal",
            {
                alignment: go.Spot.Bottom,
                alignmentFocus: go.Spot.Top
            },
            createDeleteBtn(EventHandler.deleteNode, "刪除", 50)
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
            createBtn(EventHandler.sameDisease, "相同疾病", "#FFBD9D", 80),
            createBtn(EventHandler.containGen, "帶基因者", "#FFBD9D", 80),
            createBtn(EventHandler.isPregnant, "懷   孕", "#FFBD9D", 80),
            createBtn(null, "多個體", "#FFBD9D", 80),
            createBtn(EventHandler.isDead, "死   亡", "#FFBD9D", 80),
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