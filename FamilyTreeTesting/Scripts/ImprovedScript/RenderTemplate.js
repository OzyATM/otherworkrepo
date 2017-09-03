﻿var goObject = go.GraphObject.make;
// *******************************************
// Static Definitions
// *******************************************


//*********************************************
// Main Node Template Definition
// Input Data Control:
// Main Shape
// - mainFigure: shape of the main object
// - fill: color of the main object
// - isPatient: show or hide the patient arrow
// - deadSymbolVisible: show or hide the death cross line
// - containGenVisible: show or hide the contain gen circle
// - isPVisable: show or hide the pragnent label
// - colorForP: color of the pragnent label
// - textForMultiIndividual: text for the Multi-Individual
// - colorForMultiIndividual: color of multi individual text
// - isMultiIndividualVisable: show or hide multi individual text
// - isAdoptedSignVisible: show or hide the adoption sign
//*********************************************
function generateNodeTemplate() {
    var personNodeTemplate = goObject(
        go.Node,
        "Position", // Alignment setting is not used, we manually set item position
        generateMainShape(),
        {
            selectionAdornmentTemplate: generateMainAdornment()
        },
        new go.Binding("location","loc", go.Point.parse),
        generateSlashLineInPanel(),
        generateContainGenCircle(),
        generatePTextBlock(),
        generateMultiIndividualTextBlock(),
        generateArrowPointToPatient(),
        generateAdoptSignInPanel(),
        generateTextBlockForNote(50, "noteOne"),
        generateTextBlockForNote(65, "noteTwo"),
        generateTextBlockForNote(80, "noteThree")
    );
    return personNodeTemplate;
}

//*********************************************
// Main Shape Definition
// Input Data Control:
// - mainFigure: shape of the main object
// - fill: the shape's color
//*********************************************
function generateMainShape() {
    var tempShape = goObject(
            go.Panel,
            createPort("T", new go.Point(16, 0)),
            createPort("R", new go.Point(32, 16)),
            createPort("B", new go.Point(16, 32)),
            createPort("L", new go.Point(0, 16)),
            goObject(
                go.Shape,
                {
                    width: 30,
                    height: 30,
                    strokeWidth: 5,
                    maxSize: new go.Size(40, 40),
                    cursor: "pointer",
                },
                new go.Binding("figure", "mainFigure"),
                new go.Binding("fill")
            )
        )
    return tempShape;
}

//*********************************************
// Panel With Line2(slash line) Definition
// Input Data Control:
// - deadSymbolVisible: make the Line2 Visible or not
//*********************************************
function generateSlashLineInPanel() {
    var tempPanel = goObject(
        go.Panel,
        "Position",
        {
            width: 45,
            height: 45,
            position: new go.Point(-5, -5)
        },
        goObject(
            go.Shape,
            "Line2",
            {
                width: 42,
                height: 42,
                stroke: "black",
                strokeWidth: 3,
                position: new go.Point(-5, -5)
            },
            new go.Binding("visible", "deadSymbolVisible")
        )
    )
    return tempPanel
}

//*********************************************
// The circle for containGen Definition
// Input Data Control:
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
            fill: "black",
            maxSize: new go.Size(15, 15),
            position: new go.Point(9.5, 9.5),
        },
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
function generatePTextBlock() {
    var tempTextBlock = goObject(
        go.TextBlock,
        "P",
        {
            font: "10pt sans-serif",
            position: new go.Point(14, 11)
        },
        new go.Binding("visible", "isPVisable"),
        new go.Binding("stroke", "colorForP")
    )
    return tempTextBlock;
}

//*********************************************
// Textblock for Multi-Individual Definition
// Input Data Control:
// - textForMultiIndividual: text for the Multi-Individual
// - colorForMultiIndividual: color of multi individual
// - isMultiIndividualVisable: does the text of Multi-Individual visible
//*********************************************
function generateMultiIndividualTextBlock() {
    var tempTextBlock = goObject(
        go.TextBlock,
        {
            font: "10pt sans-serif",
            stroke: "black",
            position: new go.Point(14, 11)
        },
        new go.Binding("text", "textForMultiIndividual"),
        new go.Binding("stroke", "colorForMultiIndividual"),
        new go.Binding("visible", "isMultiIndividualVisable")
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
            font: "10pt sans-serif",
            stroke: "black",
            position: new go.Point(0, 35)
        },
        new go.Binding("visible", "isPatient")
    )
    return tempTextBlock;
}

//*********************************************
// Create Textblock for Note
// Input Data Control:
// - inputDataBoundTo: set a property on node that is bound to text
//*********************************************
function generateTextBlockForNote(positionY, dataBoundTo) {
    var inputDataBoundTo = dataBoundTo
    var inputPositionY = positionY
    var tempTextBlock = goObject(
        go.TextBlock,
        {
            text: "",
            font: "10pt sans-serif",
            stroke: "black",
            visible: true,
            position: new go.Point(0, inputPositionY)
        },
        new go.Binding("text", inputDataBoundTo)
    )
    return tempTextBlock;
}

//*********************************************
// Panel With textBlock(adopted sign) Definition
// Input Data Control:
// - isAdoptedSignVisible: make the adopted sign Visible or not
//*********************************************
function generateAdoptSignInPanel() {
    var tempPanel = goObject(
        go.Panel,
        "Position",
        {
            width: 65,
            height: 50,
            position: new go.Point(-14.5,-8)
        },
        goObject(
            go.TextBlock,
            {
                text: "[   ]",
                font: "34pt sans-serif",
                stroke: "black",
                visible: false
            },
            new go.Binding("visible", "isAdoptedSignVisible")
        )
    )
    return tempPanel
}

//*********************************************
// Adornment Definition
//*********************************************
function generateMainAdornment() {
    var tempAdornment = goObject(
        go.Adornment,
        "Position",
        goObject(go.Placeholder), // make sure the admornment's position will not at a weird place(according to API it should be inside a panel or a group)
        generateMainShapeForAdornment(),
        generateHorizontalPanelWithDelBtn(),
        generateRightVerticalPanelWithBtn(),
        generateLeftVerticalPanelWithBtn()
    );
    return tempAdornment;
}

//*********************************************
// Adornment's Shape and its Definition
//*********************************************
function generateMainShapeForAdornment() {
    var tempShapeForAdm = goObject(
        go.Shape,
        "Square",
        {
            height: 50,
            width: 50,
            fill: null,
            stroke: "blue",
            strokeWidth: 3,
            position: new go.Point(5, -1)
        }
    )
    return tempShapeForAdm
}

//*********************************************
// Create a Horizontal Panel and Put Delete Btn 
//*********************************************
function generateHorizontalPanelWithDelBtn() {
    var tempHorizontalPanel = goObject(
        go.Panel,
        "Horizontal",
        {
            position: new go.Point(2, 55)
        },
        createDeleteBtn(EventHandler.deleteNode, "刪除", 50)
    )
    return tempHorizontalPanel;
}

//*********************************************
// Create a Vertical Panel on the Right Hand Side and put btn in it
//*********************************************
function generateRightVerticalPanelWithBtn() {
    var thempRightVerticalPanel = goObject(
        go.Panel,
        "Vertical",
        {
            position: new go.Point(64, -100)
        },
        createBtn(EventHandler.loadGenderType, "換性別", null, null),
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
    )
    return thempRightVerticalPanel;
}

//*********************************************
// Create a Vertical Panel on the Left Hand Side and put btn in it
//*********************************************
function generateLeftVerticalPanelWithBtn() {
    var thempLeftVerticalPanel = goObject(
        go.Panel,
        "Vertical",
        {
            position: new go.Point(-86, -100)
        },
        createBtn(EventHandler.sameDisease, "相同疾病", "#FFBD9D", 80),
        createBtn(EventHandler.containGen, "帶基因者", "#FFBD9D", 80),
        createBtn(EventHandler.isPregnant, "懷   孕", "#FFBD9D", 80),
        createBtn(EventHandler.loadMultiIndividual, "多個體", "#FFBD9D", 80),
        createBtn(EventHandler.isDead, "死   亡", "#FFBD9D", 80),
        createBtn(EventHandler.loadComment, "註   解", "#FFBD9D", 80)
    )
    return thempLeftVerticalPanel;
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

function createVisibleBtn(event, btnText, btnColor, width, controlVariable, inputFunction) {
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
            new go.Binding("visible", controlVariable, function (v) { return inputFunction(v); }),
            goObject(
                go.TextBlock,
                inputText,
                { font: "bold 10pt sans-serif" }
            )
        )
    return createdBtn
}

//*********************************************
// Create Port on Node Definition
//*********************************************
function createPort(protName, portPosition) {
    var inputPortName = protName;
    var inputPortPosition = portPosition
    var tempPort = goObject(
        go.Shape,
        {
            fill: null,
            stroke: null,
            desiredSize: new go.Size(1, 1),
            portId: inputPortName,
            position: inputPortPosition
        }
    )
    return tempPort;
}

// ***************************************
// Initialized and create the font select stuff on the navi bar
// ***************************************
function createStuffOnNaviBar() {
    // created the font select btn
    $('#fontstyle').fontselect();
    $('#fontselect').addClass("disabledbutton");
}
