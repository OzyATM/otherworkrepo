var tempKey = -1;
var tempObj;
var globalLocX = -470;
var globalLocY = -190;

var globalState = {
    tool: null,
}

function init() {
    var GO = go.GraphObject.make;  // for conciseness in defining templates

    // ********************* graph set up ************************************ //
    var diagramPropties = {
        allowDrop: true,  // must be true to accept drops from the Palette
        "draggingTool.isGridSnapEnabled": true,
        //linkReshapingTool: GO(SnapLinkReshapingTool),
        // when the user reshapes a Link, change its Link.routing from AvoidsNodes to Orthogonal,
        // so that combined with Link.adjusting == End the link will retain its reshaped mid points
        // even after nodes are moved
        //"LinkReshaped": function (e) { e.subject.routing = go.Link.Orthogonal; },
        "animationManager.isEnabled": false,
        //"undoManager.isEnabled": false,
        initialContentAlignment: go.Spot.Center,
        "LinkDrawn": maybeChangeLinkCategory,
        "LinkRelinked": maybeChangeLinkCategory,
        "undoManager.isEnabled": true,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
    }

    // must name or refer to the DIV HTML element (eg myDiagramDiv)
    myDiagram = GO(go.Diagram, "myDiagramDiv", diagramPropties);

    // **************** disable some built in default function **************** //

    // disable some keybored function
    myDiagram.commandHandler.selectAll = false;
    myDiagram.commandHandler.doKeyDown = function () {
        var e = myDiagram.lastInput;
        if (e.key == "Del") return;
        if (e.ur.keyCode == 17) return;
    }
    //myDiagram.toolManager.mouseDownTools.insertAt(3, new GeometryReshapingTool());
    myDiagram.allowResize = false;
    myDiagram.allowReshape = false;
    myDiagram.allowRotate = false;

    // disable mouse draging and selection function
    myDiagram.toolManager.dragSelectingTool.isEnabled = false;

    // disable diagram auto focus
    myDiagram.doFocus = function () {
        var x = window.scrollX || window.pageXOffset;
        var y = window.scrollY || window.pageYOffset;
        go.Diagram.prototype.doFocus.call(this);
        window.scrollTo(x, y);
    }
    // ***************************************************************************** //

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    // ****************** free draw *********************** //

    // GraphObject.make(type, initializers)

    var partProperties =
    {
        locationSpot: go.Spot.Center,
        isLayoutPositioned: false,
        zOrder: 0
    }

    var adornmentTemplateForFreeDraw = GO(go.Adornment, "Vertical", GO(go.Placeholder, { margin: -1 }), createDeleteBtn(deleteCommit, "刪除", 50))


    var adornmentForFreeDraw =
        {
            selectionAdorned: true,
            selectionObjectName: "SHAPE",
            selectionAdornmentTemplate: adornmentTemplateForFreeDraw

        }

    //orginally we use null for fill, but i cant  select node anymore if i use transparent
    var shapeOfFreeDraw = GO(go.Shape,
         { name: "SHAPE", fill: "transparent", strokeWidth: 1.5 },
         new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
         new go.Binding("angle").makeTwoWay(),
         new go.Binding("geometryString", "geo").makeTwoWay(),
         //new go.Binding("fill"),
         //new go.Binding("stroke"),
         new go.Binding("strokeWidth"))


    var freeDrawPart = GO(go.Part, partProperties, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), adornmentForFreeDraw, shapeOfFreeDraw)

    myDiagram.nodeTemplateMap.add("FreehandDrawing", freeDrawPart);


    // ********************* main node definition **************************** //


    var defaultObject =
        GO(
            go.Shape,
            "Square",
            {
                width: 30,
                height: 30,
                strokeWidth: 5,
                portId: "",
                maxSize: new go.Size(40, 40),
                cursor: "pointer",
                fill: "white"
            },
            new go.Binding("figure"),
            new go.Binding("fill")
       )
    var containGen =
        GO(
            go.Shape,
            "Circle",
            {
                width: 100,
                height: 100,
                stroke: null,
                maxSize: new go.Size(15, 15),
                fill: "",
                visible: false
            },
            new go.Binding("fill", "color"),
            new go.Binding("visible", "color_visible")
       )
    var deadSymbol =
        GO(
            go.Shape,
            "Line2",
            {
                width: 40,
                height: 40,
                maxSize: new go.Size(40, 40),
                fill: "black",
                visible: false,
                strokeWidth: 3
            },
            new go.Binding("figure", "status"),
            new go.Binding("visible")
       )
    var pregnantText =
        GO(
            go.TextBlock,
            "",
            {
                font: "10pt sans-serif ",
                visible: true
            },
           new go.Binding("text", "pregnancy"),
           new go.Binding("stroke", "stroke-pregnancy")
       )

    var panelForObjects =
        GO(
           go.Panel,
           "Spot",
           {
               name: "PANEL"
           },
           defaultObject,
           containGen,
           deadSymbol,
           pregnantText,
           // four small named ports, one on each side: 
           makePort("T", go.Spot.Top, false, true),
           makePort("L", go.Spot.Left, true, true),
           makePort("R", go.Spot.Right, true, true),
           makePort("B", go.Spot.Bottom, true, false)
       )

    var textPanel = GO(go.Panel, "Table", { name: "PANEL", margin: new go.Margin(0, 0, 0, 0) }, createTextBlock(0, 0, 10, "text"),
        createTextBlock(1, 0, 8, "noteOne"), createTextBlock(1, 1, 8, "noteTwo"), createTextBlock(1, 2, 8, "noteThree"))

    // this Adornment has a rectangular blue Shape around the selected node
    var mainPanelForAdm = GO(go.Panel, "Auto", GO(go.Shape, "Circle", { fill: null, stroke: "blue", strokeWidth: 3 }), GO(go.Placeholder))

    var hroizontalPnlInsideVerticalPnl =
        GO(
            go.Panel,
            "Horizontal",
            createBtn(addBrotherNodeAndLink, "兄", null, 32),
            createBtn(addBrotherNodeAndLink, "弟", null, 32)
        )

    var rightVerticalPanel =
        GO(
            go.Panel,
            "Vertical",
            {
                alignment: go.Spot.Right,
                alignmentFocus: go.Spot.Left
            },
            createBtn(editgender, "換性別"),
            createBtn(addParentsNodeAndLink, "父　母"),
            createBtn(addPartnerNodeAndLink, "配　偶"),
            hroizontalPnlInsideVerticalPnl,
            createBtn(addSisterNodeAndLink, "姊　妹"),
            createBtn(addSonNodeAndLink, "兒　子"),
            createBtn(addDaughterNodeAndLink, "女　兒")
        )

    var horizontalPanel =
        GO(
            go.Panel,
            "Horizontal",
            {
                alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top
            },
            createDeleteBtn(deleteNode, "刪　除", 80)
        )

    var leftVerticalPanel = GO(go.Panel, "Vertical",
               { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right }, createBtn(changeColor, "相同疾病", "#FFBD9D", 80), createBtn(changeGene, "帶基因者", "#FFBD9D", 80),
               createBtn(changePregnancy, "懷   孕", "#FFBD9D", 80), createBtn(editIndividual, "多個體", "#FFBD9D", 80), createBtn(changeStatus, "死   亡", "#FFBD9D", 80),
               createBtn(editReason, "註   解", "#FFBD9D", 80))


    var adornmentProps = GO(go.Adornment, "Spot", mainPanelForAdm, rightVerticalPanel, horizontalPanel, leftVerticalPanel)

    myDiagram.nodeTemplate =
     GO(go.Node, "Vertical", { locationSpot: go.Spot.Center, movable: false },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), panelForObjects, textPanel,
       {
           selectionAdornmentTemplate: adornmentProps
       })


    // ********************** comment box ********************* //

    var textBlockForComment = GO(go.TextBlock,
        {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
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

    var admShapeForComment = GO(go.Shape, { fill: null, stroke: "blue", strokeWidth: 3, maxSize: new go.Size(100, 50) })

    var commentPanel = GO(go.Panel, "Horizontal", { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top }, createDeleteBtn(deleteCommit, "刪除", 50))

    var admForComment = GO(go.Adornment, "Spot", admShapeForComment, GO(go.Placeholder, { margin: -1 }), commentPanel)

    myDiagram.nodeTemplateMap.add("Comment",
    GO(go.Node, "Auto", nodeStyle(), textBlockForComment,
        {
            selectionAdornmentTemplate: admForComment
        }
    ));

    // *********************** caretaker definition ************************* //

    // when i add caremale into nodetemplatemap it will generate a category call caremale(not 100% sure yet)
    myDiagram.nodeTemplateMap.add("CareMale", nodeForCaretaker("M"));
    myDiagram.nodeTemplateMap.add("CareFemale", nodeForCaretaker("F"));

    // *********************** button registration ***************************** //

    function btnRegist() {
        //字型選擇按鈕的生成
        $('#fontstyle').fontselect();
        $('#fontselect').addClass("disabledbutton");

        var changegen = document.getElementById("changegen");
        var deadButton = document.getElementById("deadButton");
        document.getElementById("freedraw").onclick = freeDraw;
        var eventListener = document.getElementById("confirm");
        eventListener.onclick = comfirmOnCss;
        var eventListener2 = document.getElementById("confirm2");
        eventListener2.onclick = comfirmOnCss;
        var eventListener3 = document.getElementById("confirm3");
        eventListener3.onclick = comfirmGender;
        var eventListener = document.getElementById("removeReason");
        eventListener.onclick = removeReason;
        var eventListener2 = document.getElementById("remove_n");
        eventListener2.onclick = remove_n;

        document.getElementById("commit").onclick = addcommit;
        document.getElementById("bold").onclick = changetextbold;
        document.getElementById("italic").onclick = changetextitalic;
        document.getElementById("underline").onclick = changetextunderline;
        document.getElementById("strikethrough").onclick = changetextstrikethrough;
        document.getElementById("fontsize").onclick = clicktextsize;
        document.getElementById("fontsize").onchange = changetextsize;
        document.getElementById("fontstyle").onclick = clicktextstyle;
        document.getElementById("fontstyle").onchange = changetextstyle;

        document.getElementById("increaseZoom").onclick = increaseZoom;
        document.getElementById("decreaseZoom").onclick = decreaseZoom;
    }

    //************************ objClick / backgroundClick / change selection  *****************//

    myDiagram.addDiagramListener("ObjectSingleClicked",
    function (e) {
        var part = e.subject.part
        if (part.data.sex === "M" || part.data.sex === "F" || part.data.sex === "Baby" || part.data.sex === "Unknown") {
            tempKey = part.data.key
            preloadGenderType(part.data.sex);
            noteOnNode(part);
            pregnancyCheck(part);
        }
        if (part.data.category === "Comment")
            setDefaultNaviBar(part)
    });

    myDiagram.addDiagramListener("ChangedSelection",
    function (e) {
        var currentObjIdx = findCurrentIndex(tempKey)
        if (jQuery.type(myDiagram.model.nodeDataArray[currentObjIdx]) !== "undefined" && myDiagram.model.nodeDataArray[currentObjIdx].category === "Comment") {
            if (myDiagram.model.nodeDataArray[currentObjIdx].text === "") {
                myDiagram.model.nodeDataArray[currentObjIdx].text = "請輸入文字"
                myDiagram.rebuildParts();
            }
        }

    });

    myDiagram.addDiagramListener("BackgroundSingleClicked",
    function (e) {

        disableClickOnNaviBarForTextBlock();

        if (jQuery.type(myDiagram.model.nodeDataArray[currentComment]) !== "undefined") {
            var currentComment = findCurrentIndex(tempKey)
            if (myDiagram.model.nodeDataArray[currentComment].text === "") {
                myDiagram.model.nodeDataArray[currentComment].text = "請輸入文字";
                myDiagram.rebuildParts();
            }
        }

    });

    function editReason(e, obj) {
        var tempIndex = findCurrentIndex(tempKey)
        document.getElementById("deadButton").click();
        if (myDiagram.model.nodeDataArray[tempIndex].noteOne !== undefined) {
            document.getElementById('NoteOneOnHTML').value = myDiagram.model.nodeDataArray[tempIndex].noteOne
            document.getElementById('NoteTwoOnHTML').value = myDiagram.model.nodeDataArray[tempIndex].noteTwo
            document.getElementById('NoteThreeOnHTML').value = myDiagram.model.nodeDataArray[tempIndex].noteThree
        }
        else {
            document.getElementById('NoteOneOnHTML').value = ""
            document.getElementById('NoteTwoOnHTML').value = ""
            document.getElementById('NoteThreeOnHTML').value = ""
        }
    }
    function editIndividual(e, obj) {
        var tempIndex = findCurrentIndex(tempKey)
        if (myDiagram.model.nodeDataArray[tempIndex].pregnancy !== "P" && myDiagram.model.nodeDataArray[tempIndex].color !== "black") {
            document.getElementById("n_btn").click();
        }
        else {
            swal({
                title: "警告!",
                text: "此功能僅在未具有相同疾病、未帶基因與未懷孕者，方可點擊",
                type: "warning"
            });
        }
        if (myDiagram.model.nodeDataArray[tempIndex].pregnancy !== undefined) {
            document.getElementById('n_type').value = myDiagram.model.nodeDataArray[tempIndex].pregnancy
        }
        else {
            document.getElementById('n_type').value = ""
        }
    }

    function editgender(e, obj) {
        var tempIndex = findCurrentIndex(tempKey)
        document.getElementById("changegen").click();
    }
    // **************************************************************** //
    function nodeStyle() {
        return [
        // The Node.location comes from the "loc" property of the node data, 
        // converted by the Point.parse static method. 
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method. 
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
            // the Node.location is at the center of each node 
            locationSpot: go.Spot.Center,
            //isShadowed: true, 
            //shadowColor: "#888", 
            // handle mouse enter/leave events to show/hide the ports 
            //mouseEnter: function (e, obj) { showPorts(obj.part, true); }, 
            //mouseLeave: function (e, obj) { showPorts(obj.part, false); } 
        }
        ];
    }

    // ************************* LinkLabel definition(label node on the horizontal line) **************************** //
    var labelNodeShape = GO(go.Shape, "Circle",
          {
              width: 1, height: 1, stroke: "black", strokeWidth: 2,
              portId: "", fromLinkable: false, toLinkable: false,
              angle: 315, visible: false
          },
          new go.Binding("figure", "adopt"),
          new go.Binding("visible"),
          new go.Binding("width"),
          new go.Binding("height"),
          new go.Binding("angle")
          )

    var labelNode = GO(go.Node, "Spot",
        {
            selectable: false, avoidable: false,
            layerName: "Foreground"
        },
        labelNodeShape,
        makePort("B", go.Spot.Bottom, true, false))

    myDiagram.nodeTemplateMap.add("LinkLabel", labelNode);

    // **************************** link(line) definition ********************************* //

    var admForLine = GO(go.Adornment, "Spot",
        GO(go.Panel, "Horizontal",
            { alignment: go.Spot.Top, alignmentFocus: go.Spot.Bottom }, createBtn(marriage, "結婚", null, 70), createBtn(divorce, "離婚", null, 70),
            createBtn(separate, "分居", null, 70), createBtn(liveTogether, "同居", null, 70))
        )

    myDiagram.linkTemplate = linkDef(admForLine)

    // ******************** link to link definiation ****************** //
    var linkToLinkAdm = GO(go.Adornment, "Spot",
        GO(go.Panel, "Vertical",
            { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, segmentIndex: -1, segmentFraction: 0.1 },
            createBtn(editborn, "領養", null, 70))
        )

    myDiagram.linkTemplateMap.add("linkToLink", linkDef(linkToLinkAdm, "Orthogonal"));

    // ******************* Node on link *********************** //
    // GraphLinksModel support for link label nodes requires specifying two properties.
    myDiagram.model =
      GO(go.GraphLinksModel,
        { linkLabelKeysProperty: "labelKeys" });



    /*-------------------------產生新的線時，將線上結點存入數據------------------------------*/
    myDiagram.toolManager.linkingTool.archetypeLabelNodeData =
      { category: "LinkLabel" };


    // ******************************* not sure function that might can be delete ******************* //

    /*-------------------------呼叫線的事件---------------------------------------------*/
    function maybeChangeLinkCategory(e) {
        var link = e.subject;
        var linktolink = (link.fromNode.isLinkLabel || link.toNode.isLinkLabel);
        e.diagram.model.setCategoryForLinkData(link.data, (linktolink ? "linkToLink" : ""));
    }
    /*-------------------------呼叫線的事件---------------------------------------------*/

    var link = myDiagram.links.first();
    if (link) link.isSelected = true;

    // **************************  adjust canvas view function *********************************** //
    document.getElementById("zoomToFit").addEventListener("click", zoom);
    function zoom() {
        myDiagram.zoomToFit();
        myDiagram.contentAlignment = go.Spot.Center;
        myDiagram.contentAlignment = go.Spot.Default;
    }

    // ******************************************************************************************** //

    function preloadGenderType(obj) {
        var input_Gender = obj
        document.getElementById("gendermale").checked;
        if (input_Gender === "M") { document.getElementById("gendermale").checked = true; }
        if (input_Gender === "F") { document.getElementById("genderfemale").checked = true; }
        if (input_Gender === "Baby") { document.getElementById("genderbaby").checked = true; }
        if (input_Gender === "Unknown") { document.getElementById("genderunknown").checked = true; }
    }

    function noteOnNode(nodePart) {
        var part = nodePart
        if (!part.data.noteOne)
            document.getElementById("NoteOneOnHTML").value = ""
        else
            document.getElementById("NoteOneOnHTML").value = part.data.noteOne
        if (!part.data.noteTwo)
            document.getElementById("NoteTwoOnHTML").value = ""
        else
            document.getElementById("NoteTwoOnHTML").value = part.data.noteTwo
        if (!part.data.noteThree)
            document.getElementById("NoteThreeOnHTML").value = ""
        else
            document.getElementById("NoteThreeOnHTML").value = part.data.noteThree
    }

    function pregnancyCheck(nodePart) {
        var part = nodePart
        if (!part.data.pregnancy)
            document.getElementById("n_type").value = ""
        else
            document.getElementById("n_type").value = part.data.pregnancy
    }

    function changeNaviBarBtnColor(nodePart, textStyle) {
        var part = nodePart
        var inputTextStyle = textStyle

        if (!part.data[inputTextStyle])
            document.getElementById(inputTextStyle).style.backgroundColor = "white"
        else
            document.getElementById(inputTextStyle).style.backgroundColor = "#ff8c00"
    }

    function fontSizeTypeOnNaviBar(nodePart, fontSizeStyle, value) {
        var part = nodePart
        var inputSizeStype = fontSizeStyle
        var inputValue = value

        if (!part.data[inputSizeStype])
            document.getElementById(inputSizeStype).value = inputValue
        else
            document.getElementById(inputSizeStype).value = part.data[inputSizeStype]
    }

    function setDefaultNaviBar(nodePart) {
        var part = nodePart
        tempKey = part.data.key
        document.getElementById("bold").value = part.data.bold
        document.getElementById("italic").value = part.data.Italic
        document.getElementById("underline").value = part.data.isUnderline
        document.getElementById("strikethrough").value = part.data.isStrikethrough
        document.getElementById("fontsize").value = part.data.fontsize
        document.getElementById("fontstyle").value = part.data.fontstyle

        $("#bold").removeClass("disabled");
        $("#italic").removeClass("disabled");
        $("#underline").removeClass("disabled");
        $("#strikethrough").removeClass("disabled");
        $(".btn-md").removeClass("disabled");
        $('#fontselect').removeClass("disabledbutton");
        $('#fontselect-drop').removeClass("display");
        document.getElementById("fontsize").disabled = false

        changeNaviBarBtnColor(part, "bold")
        changeNaviBarBtnColor(part, "italic")
        changeNaviBarBtnColor(part, "underline")
        changeNaviBarBtnColor(part, "strikethrough")

        fontSizeTypeOnNaviBar(part, "fontsize", "12")
        fontSizeTypeOnNaviBar(part, "fontstyle", "新細明體")

    }

    function disableClickOnNaviBarForTextBlock() {
        $("#bold").addClass("disabled");
        $("#italic").addClass("disabled");
        $("#underline").addClass("disabled");
        $("#strikethrough").addClass("disabled");
        $(".btn-md").addClass("disabled");
        $('#fontselect').addClass("disabledbutton");
        $('#fontselect-drop').addClass("display");
        document.getElementById("bold").style.backgroundColor = "white"
        document.getElementById("italic").style.backgroundColor = "white"
        document.getElementById("underline").style.backgroundColor = "white"
        document.getElementById("strikethrough").style.backgroundColor = "white"
        document.getElementById("fontsize").value = "12"
        document.getElementById("fontstyle").value = "新細明體"
        document.getElementById("fontsize").disabled = true
    }

    // ******************** Obj definition ********************* //
    function nodeForCaretaker(gender) {
        var shapeForNode, caretakerNode, admShape;
        if (gender === "M") {
            shapeForNode = "Square"
            admShape = "Square"
        }
        else {
            shapeForNode = "Circle"
            admShape = "Circle"
        }

        var adm = GO(go.Adornment, "Spot", GO(go.Shape, admShape, { fill: null, stroke: "blue", strokeWidth: 3 }),
                  GO(go.Panel, "Auto", GO(go.Placeholder)),
                  GO(go.Panel, "Horizontal", { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top }, createDeleteBtn(deleteCommit, "刪除", 50)))

        caretakerNode = GO(go.Node, "Vertical", nodeStyle(),
	        GO(go.Shape, shapeForNode, { fill: "white", stroke: "black", strokeWidth: 3, maxSize: new go.Size(50, 50) }),
	        GO(go.TextBlock, "",
	            {
	                margin: new go.Margin(5, 0, 0, 0),
	                font: "8pt serif"
	            },
	        new go.Binding("text")),
	            {
	                selectionAdornmentTemplate: adm
	            }
            )
        return caretakerNode
    }

    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
        // the port is basically just a small transparent square
        return GO(go.Shape, "Circle",
                 {
                     fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                     stroke: null,
                     desiredSize: new go.Size(1, 1),
                     alignment: spot,  // align the port on the main Shape
                     alignmentFocus: spot,  // just inside the Shape
                     portId: name,  // declare this object to be a "port"
                     fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                     fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                     cursor: "pointer"  // show a different cursor to indicate potential link point
                 });
    }

    function linkDef(selectionAdmStyle, routingStyle) {
        var linkSetUp, inputRoutingStyle
        var inputAdmStyle = selectionAdmStyle
        if (routingStyle != null)
            inputRoutingStyle = go.Link.Orthogonal
        else
            inputRoutingStyle = "None"

        linkSetUp = GO(go.Link,  // the whole link panel
        //{ relinkableFrom: false, relinkableTo: false },
        {
            selectable: true,
            //routing: go.Link.AvoidsNodes,  // but this is changed to go.Link.Orthgonal when the Link is reshaped
            adjusting: go.Link.End,
            cursor: "pointer",
            curve: go.Link.JumpOver,
            corner: 0,
            routing: inputRoutingStyle,
            //toShortLength: -10, // distance to the node
            mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "#227700"; },
            mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "#000000"; }
        },
        new go.Binding("points").makeTwoWay(),
        // remember the Link.routing too
        new go.Binding("routing", "routing", go.Binding.parseEnum(go.Link, go.Link.AvoidsNodes)).makeTwoWay(go.Binding.toString),
        GO(go.Shape,
          { isPanelMain: true, strokeWidth: 5, strokeDashArray: [0, 0], stroke: "#000000", name: "HIGHLIGHT" },
          new go.Binding("strokeDashArray")),
          {
              selectionAdornmentTemplate: inputAdmStyle
          }
        );
        return linkSetUp
    }


    // ********************  Button ******************* //
    function createTextBlock(colum, row, fontSize, dataBoundTo) {
        // if colum and row are both 0 it is the arraow TextBlock for patient
        var textBlock;
        var inputColum = colum;
        var inputRow = row;
        var inputFontSize = fontSize
        var fontDef = "bold " + fontSize + "pt" + " serif"
        var inputDataBound = dataBoundTo;

        textBlock = GO(go.TextBlock, "",
            {
                column: inputColum, row: inputRow,
                textAlign: 'center',
                isMultiline: false,
                font: fontDef,
                wrap: go.TextBlock.None,
                margin: 2,
                height: 13.5,
            },
            new go.Binding("text", inputDataBound))

        return textBlock;
    }

    function createDeleteBtn(event, btnText, btnWidth) {
        var deleteBtn;
        var inputEvent = event;
        var inputText = btnText;
        var inputWidth = btnWidth;
        deleteBtn = GO("Button",
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
                   GO(go.TextBlock, inputText, { font: "10pt sans-serif ", stroke: "white" }))
        return deleteBtn
    }

    function createBtn(event, btntext, btnColor, width) {
        var inputEvent = event
        var inputText = btntext
        var inputBtnColor = "#B8B8DC";
        var inputWidth = 70;
        if (btnColor != null)
            inputBtnColor = btnColor
        if (width != null)
            inputWidth = width

        var createdBtn = GO("Button",
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
            GO(go.TextBlock, inputText, { font: "bold 10pt sans-serif" }))
        return createdBtn
    }

    btnRegist();
    load();  // load a simple diagram from the textarea
}

// ********************************************************************************** //


function increaseZoom() {
    var increaseZoomOriginalSize = 1.1;
    myDiagram.commandHandler.increaseZoom(increaseZoomOriginalSize);
}
function decreaseZoom() {
    var decreaseZoomOriginalSize = 0.9;
    myDiagram.commandHandler.increaseZoom(decreaseZoomOriginalSize);
}


function freeDraw() {
    myDiagram.toolManager.panningTool.isEnabled = false;
    // create drawing tool for myDiagram, defined in FreehandDrawingTool.js
    var tool = new FreehandDrawingTool();
    // provide the default JavaScript object for a new polygon in the model
    tool.archetypePartData =
        { stroke: "black", strokeWidth: 5, category: "FreehandDrawing" };
    // allow the tool to start on top of an existing Part
    tool.isBackgroundOnly = false;
    // install as last mouse-move-tool
    myDiagram.toolManager.mouseMoveTools.add(tool);
    globalState.tool = tool;
    this.onclick = cancelFreeDraw;
    document.getElementById("freedraw").innerHTML = '<img id="freedraw_img" width="20" height="20" style="margin:2px"/>' + " 完成"
    document.getElementById("freedraw_img").src = APPLICATION_ROOT + "Content/done.png";
    //this.src = APPLICATION_ROOT + "Content/done.png";

}

function cancelFreeDraw() {
    myDiagram.toolManager.panningTool.isEnabled = true;
    myDiagram.toolManager.mouseMoveTools.remove(globalState.tool);
    this.onclick = freeDraw;
    document.getElementById("freedraw").innerHTML = '<img id="freedraw_img" width="20" height="20" style="margin:2px"/>' + " 圈選同住者"
    document.getElementById("freedraw_img").src = APPLICATION_ROOT + "Content/together.png";

}

// *********************** function for the age and dead reason ************** //

function comfirmOnCss() {
    var Reason1 = document.getElementById('NoteOneOnHTML').value;
    var Reason2 = document.getElementById('NoteTwoOnHTML').value;
    var Reason3 = document.getElementById('NoteThreeOnHTML').value;
    var n_type = document.getElementById('n_type').value;
    var tempIndex = findCurrentIndex(tempKey)
    myDiagram.model.nodeDataArray[tempIndex].noteOne = Reason1;
    myDiagram.model.nodeDataArray[tempIndex].noteTwo = Reason2;
    myDiagram.model.nodeDataArray[tempIndex].noteThree = Reason3;
    myDiagram.model.nodeDataArray[tempIndex].pregnancy = n_type;
    myDiagram.rebuildParts();
    document.getElementById('NoteOneOnHTML').value = ""
    document.getElementById('NoteTwoOnHTML').value = ""
    document.getElementById('NoteThreeOnHTML').value = ""
    document.getElementById('n_type').value = ""
}
function removeReason() {
    var tempIndex = findCurrentIndex(tempKey);
    myDiagram.model.nodeDataArray[tempIndex].noteOne = "";
    myDiagram.model.nodeDataArray[tempIndex].noteTwo = "";
    myDiagram.model.nodeDataArray[tempIndex].noteThree = "";
    myDiagram.rebuildParts();
}
function remove_n() {
    var tempIndex = findCurrentIndex(tempKey);
    myDiagram.model.nodeDataArray[tempIndex].pregnancy = "";
    myDiagram.rebuildParts();
}
function comfirmGender() {
    var tempIndex = findCurrentIndex(tempKey);
    var obj = myDiagram.model.nodeDataArray[tempIndex];
    changeGender(obj)
}

function findCurrentIndex(inputKey) {
    (myDiagram.model.nodeDataArray).forEach(function (obj, index) {
        if (obj.key === inputKey)
            tempIndex = index
    });
    return tempIndex;
}

function ValidateNumber(e, pnumber) {
    if (!/^\d+$/.test(pnumber)) {
        e.value = /^\d+/.exec(e.value);
    }
    return false;
}

// ************************************************************************ //

/*--------------------------------------------------------------------------*/

function addCarePerson(gender) {
    myDiagram.startTransaction("addCarePerson");
    var carePeronNode, categoryType
    var setObjLoc = go.Point.stringify(new go.Point(globalLocX, globalLocY))

    if (gender === "M")
        categoryType = "CareMale"
    else
        categoryType = "CareFemale"

    carePeronNode = { category: categoryType, text: "照護員", loc: setObjLoc };
    myDiagram.model.addNodeData(carePeronNode);
    myDiagram.commitTransaction("addCarePerson");

    // update globalLoc
    globalLocX += 5
    globalLocY += 5
}

function addcommit() {
    myDiagram.startTransaction("addcommit");
    var Commit_node
    var setObjLoc = go.Point.stringify(new go.Point(globalLocX, globalLocY))

    Commit_node = { category: "Comment", text: "請輸入文字", loc: setObjLoc };
    myDiagram.model.addNodeData(Commit_node);
    myDiagram.commitTransaction("addcommit");

    // update globalLoc
    globalLocX += 5
    globalLocY += 5
}
function changetextbold() {
    var currentIndex = findCurrentIndex(tempKey);
    if (myDiagram.model.nodeDataArray[currentIndex].bold) {
        myDiagram.model.nodeDataArray[currentIndex].bold = false
    }
    else {
        myDiagram.model.nodeDataArray[currentIndex].bold = true;
    }

    getRadio(myDiagram.selection.Ca.value);
}
function changetextitalic() {
    var currentIndex = findCurrentIndex(tempKey);
    if (myDiagram.model.nodeDataArray[currentIndex].Italic) {
        myDiagram.model.nodeDataArray[currentIndex].Italic = false
    }
    else {
        myDiagram.model.nodeDataArray[currentIndex].Italic = true;
    }
    getRadio(myDiagram.selection.Ca.value);
}
function changetextunderline() {
    var currentIndex = findCurrentIndex(tempKey);
    if (myDiagram.model.nodeDataArray[currentIndex].isUnderline) {
        myDiagram.model.nodeDataArray[currentIndex].isUnderline = false
        document.getElementById("underline").style.backgroundColor = "white"
    }
    else {
        myDiagram.model.nodeDataArray[currentIndex].isUnderline = true;
        document.getElementById("underline").style.backgroundColor = "#ff8c00"
    }
    myDiagram.rebuildParts();
}
function changetextstrikethrough() {
    var currentIndex = findCurrentIndex(tempKey);
    if (myDiagram.model.nodeDataArray[currentIndex].isStrikethrough) {
        myDiagram.model.nodeDataArray[currentIndex].isStrikethrough = false
        document.getElementById("strikethrough").style.backgroundColor = "white"
    }
    else {
        myDiagram.model.nodeDataArray[currentIndex].isStrikethrough = true;
        document.getElementById("strikethrough").style.backgroundColor = "#ff8c00"
    }
    myDiagram.rebuildParts();
}
function clicktextsize() {
    var fontsize = "";
    document.getElementById("fontsize").value = fontsize;
}
function changetextsize() {
    var currentIndex = findCurrentIndex(tempKey);
    var fontsize = document.getElementById("fontsize").value;
    myDiagram.model.nodeDataArray[currentIndex].fontsize = fontsize;
    getRadio(myDiagram.selection.Ca.value);
}
function clicktextstyle() {
    var fontstyle = "";
    document.getElementById("fontstyle").value = fontstyle;
}
function changetextstyle() {
    var currentIndex = findCurrentIndex(tempKey);
    var fontstyle = document.getElementById("fontstyle").value;
    myDiagram.model.nodeDataArray[currentIndex].fontstyle = fontstyle;
    getRadio(myDiagram.selection.Ca.value);
}
function changetextColor(stroke) {
    var currentIndex = findCurrentIndex(tempKey);
    myDiagram.model.nodeDataArray[currentIndex].stroke = stroke.value;
    myDiagram.rebuildParts();
}

/*--------------------------------------------------------------------------*/

function mySetNodeObjectProperty(myDiagram) {
    var selfNode = myDiagram.findNodeForKey(-1).data;
    var partnerNode = myDiagram.findNodeForKey(selfNode.partner);
    if (partnerNode !== null) {
        partnerNode = partnerNode.data;
        if (selfNode.treeLayer !== partnerNode.treeLayer) {
            delete selfNode.partner;
        } else {
            if (selfNode.father === partnerNode.father || selfNode.mother === partnerNode.mother) {
                delete selfNode.partner;
            }
        }
    }
    jQuery.each(myDiagram.model.nodeDataArray, function (index, value) {
        if (value.father !== null || value.mother !== null) {
            var fa = myDiagram.findNodeForKey(value.father);
            var mo = myDiagram.findNodeForKey(value.mother);
            if (fa === null || mo === null) {
                delete value.father;
                delete value.mother;
                if (fa === null) {
                    myDiagram.model.removeNodeData(fa);
                } else if (mo === null) {
                    myDiagram.model.removeNodeData(mo);
                }
            }
        }
    });
}

/*------------------------自訂方法----------------------------------------------------*/
//新增父母方法
function addParentsNodeAndLink(e, b) {
    // take a button panel in an Adornment, get its Adornment, and then get its adorned Node
    var node = b.part.adornedPart;
    // we are modifying the model, so conduct a transaction
    var diagram = node.diagram;
    mySetNodeObjectProperty(diagram);
    var father_key, father_newnode, father_newCategroy, father_newlabelKey, father_newlink;
    var mother_key, mother_newnode, mother_newCategroy, mother_newlabelKey, mother_newlink;
    var parentsIn = false;
    //新增層數大於第3層不予以新增
    if (node.data.treeLayer + 1 > 3) {
        swal({
            title: "警告!",
            text: "此功能僅能新增四代家族樹",
            type: "warning"
        });
        return false;
    }
    //除了自己以及長輩以外其他人不能新增父母        
    if (node.data.key !== -1 && node.data.treeLayer <= 0) {
        swal({
            title: "警告!",
            text: "此功能僅限於病患的直系關係",
            type: "warning"
        });
        return false;
    }
    //判斷父母有沒有確實存在
    jQuery.each(diagram.model.nodeDataArray, function (index, value) {
        if (value.key === node.data.father || value.key === node.data.mother) {
            parentsIn = true;
            swal({
                title: "警告!",
                text: "已有父母，不能再新增",
                type: "warning"
            });
            return false;
        }
    });
    //父母假如不在的話刪除father、mother兩個屬性
    if (!parentsIn) {
        delete node.data["father"];
        delete node.data["mother"];
    }
    if (jQuery.type(node.data.father) === "undefined" || jQuery.type(node.data.mother) === "undefined") {
        //類似資料庫交易
        diagram.startTransaction("add node and link");

        //父親圖示        
        father_newLocation = go.Point.stringify(new go.Point(node.location.x - 100, node.location.y - 200));
        father_newnode = { figure: "Square", loc: father_newLocation, sex: "M", treeLayer: node.data.treeLayer + 1 }
        diagram.model.addNodeData(father_newnode);
        father_node = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1];
        father_key = father_node.key;
        node.data["father"] = father_key;

        //母親圖示
        mother_newLocation = go.Point.stringify(new go.Point(node.location.x + 100, node.location.y - 200));
        mother_newnode = { figure: "Circle", loc: mother_newLocation, sex: "F", partner: father_key, treeLayer: node.data.treeLayer + 1 }
        diagram.model.addNodeData(mother_newnode);
        mother_key = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
        node.data["mother"] = mother_key;
        father_node["partner"] = mother_key;
        //先將圖示重新Layout，是為了防止父母連線中節點的位置跑掉
        myAutoLayout(diagram);
        //新增父母線上節點
        var newCategory = { category: "LinkLabel" };
        diagram.model.addNodeData(newCategory);
        var newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
        //新增父母連線
        var newlink = { from: father_key, to: mother_key, labelKeys: [newlabelKey], fromPort: "R", toPort: "L" };
        diagram.model.addLinkData(newlink);


        //新增兒子至父母線上節點
        var son_newCategory = { category: "LinkLabel" };
        diagram.model.addNodeData(son_newCategory);
        var son_newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
        //新增兒子至父母連線        
        var son_newlink = { from: newlabelKey, to: node.data.key, fromPort: "B", toPort: "T", labelKeys: [son_newlabelKey], category: "linkToLink" };
        diagram.model.addLinkData(son_newlink);

        //資料確認無誤後commit
        diagram.commitTransaction("add node and link");
    }
}
//新增配偶
function addPartnerNodeAndLink(e, b) {
    var node = b.part.adornedPart;
    var diagram = node.diagram;

    mySetNodeObjectProperty(diagram);
    var partner_Location, partner_newnode, partner_key, partner_shape;

    //兄弟姊妹及小孩不能新增配偶
    if (node.data.treeLayer <= 0 && node.data.key !== -1) {
        return false;
    }
    //判斷伴侶是否還存在        
    var partnerNode = diagram.findNodeForKey(node.data.partner);

    if (partnerNode === null) {
        delete node.data.partner;
    }
    if (partnerNode !== null) {
        //alert("此系統僅探討病人與直系親屬間的疾病關係，故不新增配偶");
        return false;
    }
    diagram.startTransaction("add node and link");
    //要是沒有伴侶就新增
    if (jQuery.type(node.data.partner) === "undefined") {
        if (node.data.sex === "M") {
            partner_shape = "Circle";
            partner_sex = "F";
        } else {
            partner_shape = "Square";
            partner_sex = "M";
        }
        partner_newLocation = go.Point.stringify(new go.Point(node.location.x + 150, node.location.y));
        //新增伴侶圖示        
        partner_newnode = { figure: partner_shape, sex: partner_sex, loc: partner_newLocation, partner: node.data.key, treeLayer: node.data.treeLayer }
        diagram.model.addNodeData(partner_newnode);
        partner_key = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
        node.data["partner"] = partner_key;
        //新增與伴侶的線上節點
        var newCategory = { category: "LinkLabel" };
        diagram.model.addNodeData(newCategory);
        var newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
        //新增伴侶與本人連線
        var newlink = { from: node.data.key, to: partner_key, labelKeys: [newlabelKey] };
        diagram.model.addLinkData(newlink);
        myAutoLayout(diagram);
    }
    diagram.commitTransaction("add node and link");
}
//新增伴侶及兒子
function addSonNodeAndLink(e, b) {
    var node = b.part.adornedPart;
    var diagram = node.diagram;
    mySetNodeObjectProperty(diagram);
    var parentsLinkLabelKey, father_key, mother_key;

    //包含祖父母以上及自己的小孩及兄弟姊妹不能新增兒女
    if (node.data.treeLayer > 1 || node.data.treeLayer < 0 || (node.data.treeLayer <= 0 && node.data.key !== -1)) {
        swal({
            title: "警告!",
            text: "此系統僅探討病人與直系親屬間的疾病關係，故不新增其他人兒女",
            type: "warning"
        });
        return false;
    }

    addPartnerNodeAndLink(e, b);

    //搜尋選擇的物件與伴侶線上的節點
    jQuery.each(diagram.model.linkDataArray, function (index, value) {
        if (value.from === node.data.key && value.to === node.data.partner) {
            parentsLinkLabelKey = value.labelKeys[0];
            return false;
        } else if (value.from === node.data.partner && value.to === node.data.key) {
            parentsLinkLabelKey = value.labelKeys[0];
            return false;
        }
    });
    var count = 0;
    jQuery.each(diagram.model.linkDataArray, function (index, value) {
        if (value.from === parentsLinkLabelKey) {
            count++;
        }
    });

    //類似資料庫交易
    diagram.startTransaction("add node and link");
    var son_newLocation, son_newnode, son_key;

    //判別選擇的物件是男生或女生，設定father_key,mother_key
    if (node.data.sex === "M") {
        father_key = node.data.key;
        mother_key = node.data.partner
    } else {
        father_key = node.data.partner;
        mother_key = node.data.key;
    }
    son_newLocation = go.Point.stringify(new go.Point(node.location.x + 180 + (75 * count), node.location.y + 180));

    //新增兒子圖示                
    son_newnode = { figure: "Square", loc: son_newLocation, father: father_key, mother: mother_key, sex: "M", treeLayer: node.data.treeLayer - 1 }
    diagram.model.addNodeData(son_newnode);
    son_key = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;

    //新增父母至兒子線上節點
    var son_newCategory = { category: "LinkLabel" };
    diagram.model.addNodeData(son_newCategory);
    var son_newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
    //新增兒子至父母連線        
    var son_newlink = { from: parentsLinkLabelKey, to: son_key, fromPort: "B", toPort: "T", labelKeys: [son_newlabelKey], category: "linkToLink" };
    diagram.model.addLinkData(son_newlink);
    myAutoLayout(diagram);
    //資料確認無誤後commit
    diagram.commitTransaction("add node and link");

}
//新增伴侶及女兒
function addDaughterNodeAndLink(e, b) {
    var node = b.part.adornedPart;
    var diagram = node.diagram;

    mySetNodeObjectProperty(diagram);

    var parentsLinkLabelKey, father_key, mother_key;

    //包含祖父母以上及自己的小孩及兄弟姊妹不能新增兒女
    if (node.data.treeLayer > 1 || node.data.treeLayer < 0 || (node.data.treeLayer <= 0 && node.data.key !== -1)) {
        swal({
            title: "警告!",
            text: "此系統僅探討病人與直系親屬間的疾病關係，故不新增其他人兒女",
            type: "warning"
        });
        return false;
    }
    var partnerIn = false;
    jQuery.each(diagram.model.nodeDataArray, function (index, value) {
        if (value.key === node.data.partner) {
            partnerIn = true;
            return false;
        }
    });
    if (!partnerIn) {
        delete node.data["partner"];
    }
    //要是沒有伴侶就新增
    if (jQuery.type(node.data.partner) === "undefined")
        addPartnerNodeAndLink(e, b);
    //搜尋選擇的物件與伴侶線上的節點
    jQuery.each(diagram.model.linkDataArray, function (index, value) {
        if (value.from === node.data.key && value.to === node.data.partner) {
            parentsLinkLabelKey = value.labelKeys[0];
            return false;
        } else if (value.from === node.data.partner && value.to === node.data.key) {
            parentsLinkLabelKey = value.labelKeys[0];
            return false;
        }
    });
    var count = 0;
    jQuery.each(diagram.model.linkDataArray, function (index, value) {
        if (value.from === parentsLinkLabelKey) {
            count++;
        }
    });
    //類似資料庫交易
    diagram.startTransaction("add node and link");

    var daughter_newLocation, daughter_newnode, daughter_key;

    //判別選擇的物件是男生或女生，設定father_key,mother_key
    if (node.data.sex === "M") {
        father_key = node.data.key;
        mother_key = node.data.partner;
    } else {
        father_key = node.data.partner;
        mother_key = node.data.key;
    }
    daughter_newLocation = (node.location.x + 180 + (75 * count)).toString() + " " + (node.location.y + 180).toString();
    //新增女兒圖示                
    daughter_newnode = { figure: "Circle", loc: daughter_newLocation, father: father_key, mother: mother_key, sex: "F", treeLayer: node.data.treeLayer - 1 }
    diagram.model.addNodeData(daughter_newnode);
    daughter_key = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;

    //新增父母至女兒線上節點
    var daughter_newCategory = { category: "LinkLabel" };
    diagram.model.addNodeData(daughter_newCategory);
    var daughter_newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
    //新增女兒至父母連線        
    var daughter_newlink = { from: parentsLinkLabelKey, to: daughter_key, fromPort: "B", toPort: "T", labelKeys: [daughter_newlabelKey], category: "linkToLink" };
    diagram.model.addLinkData(daughter_newlink);
    myAutoLayout(diagram);
    //資料確認無誤後commit
    diagram.commitTransaction("add node and link");

}
//刪除節點
function deleteNode(e, b) {
    var node = b.part.adornedPart;
    var diagram = node.diagram;
    if (node.data.key === -1 || node.data.key === -2 || node.data.key === -3) {
        swal({
            title: "警告!",
            text: "病人與父母為基本角色，不能刪除",
            type: "warning"
        });
        return false;
    }
    mySetNodeObjectProperty(diagram);
    diagram.startTransaction("delete node");

    if (node.data.treeLayer > 1) {
        var fa = diagram.findNodeForKey(node.data.father);
        var mo = diagram.findNodeForKey(node.data.mother);
        var par = diagram.findNodeForKey(node.data.partner);

        diagram.commandHandler.deleteSelection();

        if (fa !== null) {
            //diagram.model.removeNodeData(fa.data);
            //var links = node.linksConnected;
            //while (links.next()) {
            //    console.log(links.next());
            //}
            diagram.select(fa);
            diagram.commandHandler.deleteSelection();

        }
        if (mo !== null) {
            //    diagram.model.removeNodeData(mo.data);
            diagram.select(mo);
            diagram.commandHandler.deleteSelection();
        }
        if (par !== null) {
            //    diagram.model.removeNodeData(par.data);
            diagram.select(par);
            diagram.commandHandler.deleteSelection();
            var par_mo = diagram.findNodeForKey(par.data.mother);
            var par_fa = diagram.findNodeForKey(par.data.father);
            if (par_mo !== null) {
                diagram.select(par_mo);
                diagram.commandHandler.deleteSelection();
            }
            if (par_fa !== null) {
                diagram.select(par_fa);
                diagram.commandHandler.deleteSelection();
            }
        }
    }
    if (node.data.treeLayer < 1) {
        diagram.commandHandler.deleteSelection();
    }
    if (node.data.partner === -1) {
        var childrenList = [];
        jQuery.each(diagram.model.nodeDataArray, function (index, value) {
            if (jQuery.type(value.treeLayer) !== "undefined") {
                if (value.treeLayer === -1) {
                    childrenList.push(value.key);
                }
            }
        });
        if (childrenList.length > 0) {
            jQuery.each(childrenList, function (index, value) {
                diagram.select(diagram.findNodeForKey(value));
                diagram.commandHandler.deleteSelection();
            });
        }
    }



    //diagram.commandHandler.deleteSelection();
    myAutoLayout(diagram);
    diagram.commitTransaction("delete node");
}
function deleteCommit(e, b) {
    //var idrag = document.getElementById("infoDraggable");
    var node = b.part.adornedPart;
    var diagram = node.diagram;
    diagram.startTransaction("delete ccommit");
    diagram.commandHandler.deleteSelection();
    $("#bold").addClass("disabled");
    $("#italic").addClass("disabled");
    $("#underline").addClass("disabled");
    $("#strikethrough").addClass("disabled");
    $(".btn-md").addClass("disabled");
    $('#fontselect').addClass("disabledbutton");
    document.getElementById("bold").style.backgroundColor = "white";
    document.getElementById("italic").style.backgroundColor = "white";
    document.getElementById("underline").style.backgroundColor = "white";
    document.getElementById("strikethrough").style.backgroundColor = "white";
    document.getElementById("fontsize").value = "12";
    document.getElementById("fontstyle").value = "新細明體";
    document.getElementById("fontsize").disabled = true;
    document.getElementById("fontstyle").disabled = true;
    diagram.commitTransaction("delete commit");

}
//新增兄弟
function addBrotherNodeAndLink(e, b) {
    var node = b.part.adornedPart;
    var diagram = node.diagram;

    if (node.data.key !== -1) {
        swal({
            title: "警告!",
            text: "本系統目前僅能新增病患兄弟",
            type: "warning"
        });
        return false;
    }
    var parentsLinkLabelKey, father_key, mother_key;
    jQuery.each(diagram.model.linkDataArray, function (index, value) {
        if (value.from === node.data.father && value.to === node.data.mother) {
            parentsLinkLabelKey = value.labelKeys[0];
            return false;
        }
    });

    diagram.startTransaction("add brother");
    var brother_newLocation, brother_newnode, brother_key;

    //判別選擇的物件是男生或女生，設定father_key,mother_key
    if (node.data.sex === "M") {
        father_key = node.data.father;
        mother_key = node.data.mother
    } else {
        father_key = node.data.father;
        mother_key = node.data.mother;
    }
    brother_newLocation = go.Point.stringify(new go.Point(node.location.x + 180, node.location.y + 180));

    //新增兒子圖示                
    brother_newnode = { figure: "Square", loc: brother_newLocation, father: father_key, mother: mother_key, sex: "M", treeLayer: node.data.treeLayer }
    diagram.model.addNodeData(brother_newnode);
    brother_key = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;

    //新增父母至兒子線上節點
    var brother_newCategory = { category: "LinkLabel" };
    diagram.model.addNodeData(brother_newCategory);
    var brother_newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
    //新增兒子至父母連線        
    var brother_newlink = { from: parentsLinkLabelKey, to: brother_key, fromPort: "B", toPort: "T", labelKeys: [brother_newlabelKey], category: "linkToLink" };
    diagram.model.addLinkData(brother_newlink);
    myAutoLayout(diagram);
    //資料確認無誤後commit
    diagram.commitTransaction("add brother");
}
//新增姊妹
function addSisterNodeAndLink(e, b) {
    var node = b.part.adornedPart;
    var diagram = node.diagram;

    if (node.data.key !== -1) {
        swal({
            title: "警告!",
            text: "本系統目前僅能新增病患姊妹",
            type: "warning"
        });
        return false;
    }
    var parentsLinkLabelKey, father_key, mother_key;
    jQuery.each(diagram.model.linkDataArray, function (index, value) {
        if (value.from === node.data.father && value.to === node.data.mother) {
            parentsLinkLabelKey = value.labelKeys[0];
            return false;
        }
    });

    diagram.startTransaction("add sister");
    var sister_newLocation, sister_newnode, sister_key;

    //判別選擇的物件是男生或女生，設定father_key,mother_key
    if (node.data.sex === "M") {
        father_key = node.data.father;
        mother_key = node.data.mother
    } else {
        father_key = node.data.father;
        mother_key = node.data.mother;
    }
    sister_newLocation = go.Point.stringify(new go.Point(node.location.x + 180, node.location.y + 180));

    //新增兒子圖示                
    sister_newnode = { figure: "Circle", loc: sister_newLocation, father: father_key, mother: mother_key, sex: "F", treeLayer: node.data.treeLayer }
    diagram.model.addNodeData(sister_newnode);
    sister_key = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;

    //新增父母至兒子線上節點
    var sister_newCategory = { category: "LinkLabel" };
    diagram.model.addNodeData(sister_newCategory);
    var sister_newlabelKey = diagram.model.nodeDataArray[diagram.model.nodeDataArray.length - 1].key;
    //新增兒子至父母連線        
    var sister_newlink = { from: parentsLinkLabelKey, to: sister_key, fromPort: "B", toPort: "T", labelKeys: [sister_newlabelKey], category: "linkToLink" };
    diagram.model.addLinkData(sister_newlink);
    myAutoLayout(diagram);
    //資料確認無誤後commit
    diagram.commitTransaction("add sister");
}

//myAutoLayout主要透過model.setDataProperty()方法重新指定圖示位置
function myAutoLayout(myDiagram) {
    mySetNodeObjectProperty(myDiagram);
    //同一層圖形的間距
    var columnSpace = 50;
    //層與層的間距
    var rowSpace = 200;

    var greatGrandparentsList = [];
    var grandparentsList = [];
    var parentsList = [];
    var selfList = [];
    var childrenList = [];
    //取得病人NodeObject
    var selfNodeObject = myDiagram.findNodeForKey(-1).data;
    //取得病人配偶NodeObject
    var partner = myDiagram.findNodeForKey(selfNodeObject.partner);
    if (partner !== null) {
        partner = partner.data;
    }

    var maxLayer = 0;
    var minLayer = 0;

    //依照nodeObject.layer做層次區分
    jQuery.each(myDiagram.model.nodeDataArray, function (index, value) {
        if (jQuery.type(value.treeLayer) !== "undefined") {
            switch (value.treeLayer) {
                case 3:
                    greatGrandparentsList.push(value);
                    break;
                case 2:
                    grandparentsList.push(value);
                    break;
                case 1:
                    parentsList.push(value);
                    break;
                case 0:
                    //不讓配偶加入兄弟姐妹陣列裡面
                    if (partner !== null) {
                        if (value.key !== partner.key) {

                            selfList.push(value);
                        }
                    } else {
                        selfList.push(value);
                    }
                    break;
                case -1:
                    childrenList.push(value);
                    break;
            }
        }

        if (value.treeLayer > maxLayer) {
            //取得最高層次
            maxLayer = value.treeLayer;
        } else if (value.treeLayer < minLayer) {
            //取得最低層次
            minLayer = value.treeLayer;
        }
    });

    //myDiagram.startTransaction("add node and link");

    var selfNodelocation = go.Point.parse(selfNodeObject.loc);
    //判斷病人本身有沒有配偶
    if (partner !== null) {
        newPoint = new go.Point(selfNodelocation.x + columnSpace * 2, selfNodelocation.y);
        myDiagram.model.setDataProperty(partner, "loc", go.Point.stringify(newPoint));
    }
    //selfList大於1，表示與病人同一層有配偶或兄弟姊妹
    if (selfList.length > 1) {
        //有配偶的話，Layout時要預留配偶位置
        if (partner !== null) {
            jQuery.each(selfList, function (index, value) {
                if (value.key !== selfNodeObject.key || value.key !== partner.key) {
                    if (index % 2 === 1) {
                        newPoint = new go.Point(selfNodelocation.x + columnSpace * 2 + columnSpace * (index + 1), selfNodelocation.y);
                    } else {
                        newPoint = new go.Point(selfNodelocation.x - columnSpace * index, selfNodelocation.y);
                    }
                    myDiagram.model.setDataProperty(value, "loc", go.Point.stringify(newPoint));
                }
            });
        } else {
            //沒有配偶的情況下Layout
            jQuery.each(selfList, function (index, value) {
                if (value.key !== selfNodeObject.key) {
                    if (index % 2 === 1) {
                        newPoint = new go.Point(selfNodelocation.x + columnSpace * (index + 1), selfNodelocation.y);
                    } else {
                        newPoint = new go.Point(selfNodelocation.x - columnSpace * index, selfNodelocation.y);
                    }
                    myDiagram.model.setDataProperty(value, "loc", go.Point.stringify(newPoint));
                }
            });
        }
    }
    //childrenList表示病人有小孩
    if (childrenList.length > 0) {
        jQuery.each(childrenList, function (index, value) {
            if (index % 2 === 1) {
                newPoint = new go.Point(selfNodelocation.x + columnSpace * 2 + columnSpace * index, selfNodelocation.y + rowSpace);
            } else {
                newPoint = new go.Point(selfNodelocation.x + columnSpace - columnSpace * index, selfNodelocation.y + rowSpace);
            }
            myDiagram.model.setDataProperty(value, "loc", go.Point.stringify(newPoint));
        });
    }

    if (jQuery.type(selfNodeObject.father) !== "undefined" && jQuery.type(selfNodeObject.mother) !== "undefined") {
        var newPoint;
        //設定父親位置
        var fatherNode = myDiagram.findNodeForKey(selfNodeObject.father).data;
        newPoint = new go.Point(selfNodelocation.x - columnSpace - (columnSpace * maxLayer), selfNodelocation.y - rowSpace);
        myDiagram.model.setDataProperty(fatherNode, "loc", go.Point.stringify(newPoint));

        //設定母親位置
        var motherNode = myDiagram.findNodeForKey(selfNodeObject.mother).data;
        newPoint = new go.Point(selfNodelocation.x + columnSpace + (columnSpace * maxLayer), selfNodelocation.y - rowSpace);
        myDiagram.model.setDataProperty(motherNode, "loc", go.Point.stringify(newPoint));
        //設定祖父母的位置
        jQuery.each(parentsList, function (index, parentsList) {
            if (jQuery.type(parentsList.father) !== "undefined" && jQuery.type(parentsList.mother) !== "undefined") {
                var parentlocation = go.Point.parse(parentsList.loc);

                var grandfather = myDiagram.findNodeForKey(parentsList.father).data;
                newPoint = new go.Point(parentlocation.x - columnSpace - (columnSpace * (maxLayer - 1) / 2), parentlocation.y - rowSpace);
                myDiagram.model.setDataProperty(grandfather, "loc", go.Point.stringify(newPoint));

                var grandmother = myDiagram.findNodeForKey(parentsList.mother).data;
                newPoint = new go.Point(parentlocation.x + columnSpace + (columnSpace * (maxLayer - 1) / 2), parentlocation.y - rowSpace);
                myDiagram.model.setDataProperty(grandmother, "loc", go.Point.stringify(newPoint));
                //設定曾祖父母的位置
                jQuery.each(grandparentsList, function (index, grandparent) {
                    if (jQuery.type(grandparent.father) !== "undefined" && jQuery.type(grandparent.mother) !== "undefined") {
                        var grandparentlocation = go.Point.parse(grandparent.loc);

                        var greatgrandfather = myDiagram.findNodeForKey(grandparent.father).data;
                        newPoint = new go.Point(grandparentlocation.x - columnSpace - (columnSpace * (maxLayer - 2) / 2), grandparentlocation.y - rowSpace);
                        myDiagram.model.setDataProperty(greatgrandfather, "loc", go.Point.stringify(newPoint));

                        var greatgrandmother = myDiagram.findNodeForKey(grandparent.mother).data;
                        newPoint = new go.Point(grandparentlocation.x + columnSpace + (columnSpace * (maxLayer - 2) / 2), grandparentlocation.y - rowSpace);
                        myDiagram.model.setDataProperty(greatgrandmother, "loc", go.Point.stringify(newPoint));
                    }
                });
            }
        });
    }
    //myDiagram.commitTransaction("add node and link");
}
//重新設定NodeObject屬性
function mySetNodeObjectProperty(myDiagram) {
    var selfNode = myDiagram.findNodeForKey(-1).data;
    var partnerNode = myDiagram.findNodeForKey(selfNode.partner);
    if (partnerNode !== null) {
        partnerNode = partnerNode.data;
        if (selfNode.treeLayer !== partnerNode.treeLayer) {
            delete selfNode.partner;
        } else {
            if (selfNode.father === partnerNode.father || selfNode.mother === partnerNode.mother) {
                delete selfNode.partner;
            }
        }
    }
    jQuery.each(myDiagram.model.nodeDataArray, function (index, value) {
        if (value.father !== null || value.mother !== null) {
            var fa = myDiagram.findNodeForKey(value.father);
            var mo = myDiagram.findNodeForKey(value.mother);
            if (fa === null || mo === null) {
                delete value.father;
                delete value.mother;
                if (fa === null) {
                    myDiagram.model.removeNodeData(fa);
                } else if (mo === null) {
                    myDiagram.model.removeNodeData(mo);
                }
            }
        }
    });
}


function saveImg() {
    var ImgBaseString = myDiagram.makeImageData({ background: "white" });
    return ImgBaseString;
}
/*------------------------自訂方法----------------------------------------------------*/


// Show the diagram's model in JSON format that the user may edit
function save() {
    saveDiagramProperties();  // do this first, before writing to JSON
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}

function myZoomToFit() {
    myDiagram.zoomToFit();
    myDiagram.contentAlignment = go.Spot.Center;
}

function load() {
    if (document.getElementById("mySavedModel").value.trim().length <= 0) {
        return;
    }

    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    loadDiagramProperties();
    myDiagram.zoomToFit();
}

function saveDiagramProperties() {
    myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
}
// Called by "InitialLayoutCompleted" DiagramEvent listener, NOT directly by load()!
function loadDiagramProperties(e) {
    // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
    var pos = myDiagram.model.modelData.position;
    if (pos) myDiagram.initialPosition = go.Point.parse(pos);
    myDiagram.model.linkLabelKeysProperty = "labelKeys";
    myDiagram.model.linkFromPortIdProperty = "fromPort";
    myDiagram.model.linkToPortIdProperty = "toPort";
}