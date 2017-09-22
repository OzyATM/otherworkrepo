var goObject = go.GraphObject.make;

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
            movable: false,
            selectionAdornmentTemplate: generateMainAdornment()
        },
        new go.Binding("location","loc", go.Point.parse),
        generateSlashLineInPanel(),
        generateContainGenCircle(),
        generatePTextBlock(),
        generateMultiIndividualTextBlock(),
        generateArrowPointToPatient(),
        generateAdoptSignInPanel(),
        generateTextBlockForNote(40, "noteOne"),
        generateTextBlockForNote(55, "noteTwo"),
        generateTextBlockForNote(70, "noteThree")
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
                    cursor: "pointer"
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
            position: new go.Point(-10, 35)
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
        createVisibleBtn(EventHandler.addParent, "父　母", null, null, "isAddParentBtnVisible"),
        createVisibleBtn(EventHandler.addPartner, "配　偶", null, null, "isAddPartnerBtnVisible"),
        goObject(
            go.Panel,
            "Horizontal",
            createVisibleBtn(EventHandler.addElderBrother, "兄", null, 32, "isAddSiblingBtnVisible"),
            createVisibleBtn(EventHandler.addYoungerBrother, "弟", null, 32, "isAddSiblingBtnVisible")
        ),
        goObject(
            go.Panel,
            "Horizontal",
            createVisibleBtn(EventHandler.addElderSister, "姊", null, 32, "isAddSiblingBtnVisible"),
            createVisibleBtn(EventHandler.addYoungerSister, "妹", null, 32, "isAddSiblingBtnVisible")
        ),
        goObject(
            go.Panel,
            "Horizontal",
            createVisibleBtn(EventHandler.addSon, "兒", null, 32, "isAddChildBtnVisible"),
            createVisibleBtn(EventHandler.addDaughter, "女", null, 32, "isAddChildBtnVisible")
        ),
        createVisibleBtn(EventHandler.isOwnChild, "親生", null, null, "isOwnSonVisible"),
        createVisibleBtn(EventHandler.isAdopted, "領養進來", null, null, "isAdoptedBtnVisible"),
        createVisibleBtn(EventHandler.gotAdopted, "被領養走", null, null, "isGotAdoptedBtnVisible")
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
        createVisibleBtn(EventHandler.sameDisease, "相同疾病", "#FFBD9D", 80, "isSameDiseaseBtnVisible"),
        createVisibleBtn(EventHandler.containGen, "帶基因者", "#FFBD9D", 80, "isContainGenBtnVisible"),
        createVisibleBtn(EventHandler.isPregnant, "懷   孕", "#FFBD9D", 80, "isPregnantBtnVisible"),
        createVisibleBtn(EventHandler.loadMultiIndividual, "多個體", "#FFBD9D", 80, "isMultiInvididualTextBtnVisible"),
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
            ),
            new go.Binding("visible", "isDeleteBtnVisible")
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

function createVisibleBtn(event, btnText, btnColor, width, controlVariable) {
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
            new go.Binding("visible", controlVariable),
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

//*********************************************
// CareTaker Template Definition
// gender
//*********************************************
function generateCareTakerTemplate(gender) {
    var shapeForNode;
    if (gender === "male") {
        shapeForNode = "Square"
    }
    else if (gender === "female") {
        shapeForNode = "Circle"
    }
    var careTakerNodeTemplate = goObject(
        go.Node,
        "Position",
        generateCareTakerNodeShape(shapeForNode),
        {
            selectionAdornmentTemplate: generateCareTakerAdornment(shapeForNode)
        },
        generateTextBlockForCareTaker(),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
    );
    return careTakerNodeTemplate;
}

//*********************************************
// Main Shape for CareTaker
//*********************************************
function generateCareTakerNodeShape(shapeForNode) {
    var tempShape = goObject(
        go.Shape,
        {
            figure: shapeForNode,
            fill: "white",
            stroke: "black",
            strokeWidth: 5,
            maxSize: new go.Size(30, 30),
            cursor: "pointer"
        }
    )
    return tempShape;
}

//*********************************************
// Text Block for CareTaker
//*********************************************
function generateTextBlockForCareTaker() {
    var tempTextBlock = goObject(
        go.TextBlock,
        "照護員",
        {
            font: "8pt serif",
            stroke: "black",
            position: new go.Point(0, 40)
        }
    )
    return tempTextBlock;
}

//*********************************************
// Generate CareTaker's Adornment
//*********************************************
function generateCareTakerAdornment() {
    var tempShapeForAdm = goObject(
        go.Adornment,
        "Position",
        goObject(go.Placeholder),
        generateCareTakerAdornmentShape(),
        generateCareTakerHorizontalPanelWithDelBtn()
    )
    return tempShapeForAdm
}

//*********************************************
// The Main Shape for the CareTaker's Adornment
//*********************************************
function generateCareTakerAdornmentShape() {
    var tempShapeForAdm = goObject(
        go.Shape,
        "Square",
        {
            maxSize: new go.Size(70, 70),
            fill: null,
            stroke: "blue",
            strokeWidth: 3,
            position: new go.Point(-19, -18)
        }
    )
    return tempShapeForAdm
}

//*********************************************
// The HorizontalPanel to put Delete Btn for CareTaker
//*********************************************
function generateCareTakerHorizontalPanelWithDelBtn() {
    var tempHorizontalPanel = goObject(
        go.Panel,
        "Horizontal",
        {
            position: new go.Point(-14, 55)
        },
        createDeleteBtn(EventHandler.deleteNode, "刪除", 50)
    );
    return tempHorizontalPanel;
}

//*********************************************
// Free Draw Template Definition
//*********************************************
function generateFreeDrawTemplate() {
    var tempFreeDrawTemplate = goObject(
        go.Part,
        generateMainShapeForFreeDrawObject(),
        {
            locationSpot: go.Spot.Center,
            selectionAdornmentTemplate: generateFreeDrawAdornment()
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
    );
    return tempFreeDrawTemplate;
}

//*********************************************
// Free Draw's Main Shape
//*********************************************
function generateMainShapeForFreeDrawObject() {
    var mainShapeForFreeDraw = goObject(
        go.Shape,
        {
            // must has this name idk y
            name: "SHAPE",
            fill: "transparent"
        },
        new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("angle").makeTwoWay(),
        new go.Binding("geometryString", "geo").makeTwoWay(),
        new go.Binding("strokeWidth")
    )
    return mainShapeForFreeDraw;
}

//*********************************************
// Free Draw's Adornment
//*********************************************
function generateFreeDrawAdornment() {
    var tempAdornmentForFreeDraw = goObject(
        go.Adornment,
        "Vertical",
        goObject(go.Placeholder),
        createDeleteBtn(EventHandler.deleteNode, "刪除", 50)
    )
    return tempAdornmentForFreeDraw;
}

//*********************************************
// Comment Box Template Definition
//*********************************************
function generateCommentBoxTemplate() {
    var tempCommentBoxTemplate = goObject(
        go.Node,
        "Position",
        generateCommentBoxTextBlock(),
        {
            selectionAdornmentTemplate: generateCommentBoxAdornment()
        },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
    )
    return tempCommentBoxTemplate;
}

//*********************************************
// Comment Box's Text Block  Definition
//*********************************************
function generateCommentBoxTextBlock() {
    var tempTextBox = goObject(
        go.TextBlock,
        {
            wrap: go.TextBlock.WrapFit,
            editable: true,
            textAlign: "center",
            font: "12pt Helvetica, Arial, sans-serif",
            stroke: "#000000",
        },
        new go.Binding("text").makeTwoWay(),
        new go.Binding("stroke", "stroke"),
        new go.Binding("font"),
        new go.Binding("bold"),
        new go.Binding("fontsize"),
        new go.Binding("Italic"),
        new go.Binding("isUnderline"),
        new go.Binding("isStrikethrough")
    )
    return tempTextBox;
}

//*********************************************
// Generate Comment Box's Adornment
//*********************************************
function generateCommentBoxAdornment() {
    var tempCommentBoxAdornment = goObject(
        go.Adornment,
        "Vertical",
        goObject(go.Placeholder),
        createDeleteBtn(EventHandler.deleteNode, "刪除", 50)
    )
    return tempCommentBoxAdornment;
}