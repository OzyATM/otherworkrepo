// this is a shared context menu button click event handler, just for demonstration
function cmCommand(e, obj) {
    var node = obj.part.adornedPart;  // the Node with the context menu
    var buttontext = obj.elt(1);  // the TextBlock
    alert(buttontext.text + " command on " + node.data.key);
}

// This method is called as a context menu button's click handler.
// Rotate the selected node's color through a predefined sequence of colors.
function changeColor(e, obj) {
    myDiagram.startTransaction("changed color");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var nodedata = contextmenu.data;
    // compute the next color for the node
    var newcolor = "black";
    switch (nodedata.fill) {
        case "white": newcolor = "black"; break;
        case "black": newcolor = "white"; break;
    }

    if (nodedata.fill === "black") { nodedata.color = "black" };
    // modify the node data
    if (newcolor === "black") {
        var stroke = "white";
    }
    else {
        stroke = "black";
    }
    if (nodedata.pregnancy !== "P" && nodedata.pregnancy !== "" && nodedata.pregnancy !== undefined) {
        return false;
    }
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.model.setDataProperty(nodedata, "fill", newcolor);
    myDiagram.model.setDataProperty(nodedata, "color", newcolor);
    myDiagram.model.setDataProperty(nodedata, "stroke-pregnancy", stroke);
    myDiagram.commitTransaction("changed color");
}

function changeGene(e, obj) {
    myDiagram.startTransaction("changed DNA");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var nodedata = contextmenu.data;
    // compute the next color for the node
    var newcolor = "black";
    var color_visible = false;
    //console.log(nodedata.color);
    if (nodedata.fill !== "black") {
        switch (nodedata.color) {
            case "white": newcolor = "black"; color_visible = true; break;
            case "black": newcolor = "white"; color_visible = false; break;
        }
    } else {
        newcolor = "black";
        return false;
    }
    if (newcolor === "black") {
        var stroke = "white";
        color_visible = true;
    }
    else {
        stroke = "black";
    }
    if (nodedata.pregnancy !== "P" && nodedata.pregnancy !== "" && nodedata.pregnancy !== undefined) {
        return false;
    }

    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.model.setDataProperty(nodedata, "color", newcolor);
    myDiagram.model.setDataProperty(nodedata, "stroke-pregnancy", stroke);
    myDiagram.model.setDataProperty(nodedata, "color_visible", color_visible);
    myDiagram.commitTransaction("changed DNA");
}
function changeStatus(e, obj) {
    myDiagram.startTransaction("changed Status");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var nodedata = contextmenu.data;
    // compute the next color for the node
    var status = "Line2";
    var visible = true;
    //console.log(nodedata.status);
    switch (nodedata.status) {
        case "Line2": status = "", visible = false; break;
        case "": status = "Line2", visible = true; break;
    }

    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.model.setDataProperty(nodedata, "status", status);
    myDiagram.model.setDataProperty(nodedata, "visible", visible);
    myDiagram.commitTransaction("changed Status");
}


function adopt(e, obj) {
    myDiagram.startTransaction("changed Adopt");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var linkdata = contextmenu.data;
    // compute the next color for the node
    //console.log(linkdata.labelKeys);
    var node = obj.part.adornedPart;
    var diagram = node.diagram;
    var text = linkdata.labelKeys[0];
    var adopt_key = diagram.findNodeForKey(text);
    //console.log(JSON.stringify(adopt_key.data));
    var toArrow = "DoubleForwardSlash";
    var visible = true;
    var scale = "3";
    myDiagram.model.setDataProperty(linkdata, "toArrow", toArrow);
    myDiagram.model.setDataProperty(linkdata, "visible", visible);
    myDiagram.model.setDataProperty(linkdata, "scale", scale);
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.commitTransaction("changed Adopt");

}

function biological(e, obj) {
    myDiagram.startTransaction("changed biological");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var linkdata = contextmenu.data;
    // compute the next color for the node
    //console.log(linkdata.labelKeys);
    var node = obj.part.adornedPart;
    var diagram = node.diagram;
    var text = linkdata.labelKeys[0];
    var adopt_key = diagram.findNodeForKey(text);
    //console.log(JSON.stringify(adopt_key.data));
    var toArrow = "";
    var visible = false;
    var scale = "1";
    myDiagram.model.setDataProperty(linkdata, "toArrow", toArrow);
    myDiagram.model.setDataProperty(linkdata, "visible", visible);
    myDiagram.model.setDataProperty(linkdata, "scale", scale);
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.commitTransaction("changed biological");

}

function setReason(e, obj) {
    var contextmenu = obj.part;
    var nodedata = contextmenu.data;
    var Reason1 = document.getElementById('NoteOneOnHTML').value;
    var Reason2 = document.getElementById('NoteTwoOnHTML').value;
    var Reason3 = document.getElementById('NoteThreeOnHTML').value;


    if (document.getElementById('NoteOneOnHTML').value === "" || document.getElementById('NoteOneOnHTML').value === "") {
        if (confirm('註解為空是否要繼續')) {
            myDiagram.model.setDataProperty(nodedata, "noteOne", Reason1);
            myDiagram.model.setDataProperty(nodedata, "noteTwo", Reason2);
            myDiagram.model.setDataProperty(nodedata, "noteThree", Reason3);
        }

    } else {
        myDiagram.model.setDataProperty(nodedata, "noteOne", Reason1);
        myDiagram.model.setDataProperty(nodedata, "noteTwo", Reason2);
        myDiagram.model.setDataProperty(nodedata, "noteThree", Reason3);
    }
}

function marriage(e, obj) {
    myDiagram.startTransaction("changed marriage");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var linkdata = contextmenu.data;
    // compute the next color for the node
    console.log(linkdata.labelKeys);
    var node = obj.part.adornedPart;
    var diagram = node.diagram;
    var text = linkdata.labelKeys[0];
    var marriage_key = diagram.findNodeForKey(text);
    console.log(JSON.stringify(marriage_key.data));
    var marriage = "Circle";
    var visible = false;
    var width = 1;
    var height = 1;
    var angle = 0;
    var strokeDashArray = [0, 0];
    myDiagram.model.setDataProperty(marriage_key.data, "adopt", marriage);
    myDiagram.model.setDataProperty(marriage_key.data, "visible", visible);
    myDiagram.model.setDataProperty(marriage_key.data, "width", width);
    myDiagram.model.setDataProperty(marriage_key.data, "height", height);
    myDiagram.model.setDataProperty(marriage_key.data, "angle", angle);
    myDiagram.model.setDataProperty(linkdata, "strokeDashArray", strokeDashArray);
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.commitTransaction("changed marriage");

}

function divorce(e, obj) {
    myDiagram.startTransaction("changed divorce");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var linkdata = contextmenu.data;
    // compute the next color for the node
    console.log(linkdata.labelKeys);
    var node = obj.part.adornedPart;
    var diagram = node.diagram;
    var text = linkdata.labelKeys[0];
    var marriage_key = diagram.findNodeForKey(text);
    console.log(JSON.stringify(marriage_key.data));
    var marriage = "XLine";
    var visible = true;
    var width = 15;
    var height = 20;
    var angle = 0;
    var strokeDashArray = [0, 0];
    myDiagram.model.setDataProperty(marriage_key.data, "adopt", marriage);
    myDiagram.model.setDataProperty(marriage_key.data, "visible", visible);
    myDiagram.model.setDataProperty(marriage_key.data, "width", width);
    myDiagram.model.setDataProperty(marriage_key.data, "height", height);
    myDiagram.model.setDataProperty(marriage_key.data, "angle", angle);
    myDiagram.model.setDataProperty(linkdata, "strokeDashArray", strokeDashArray);
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.commitTransaction("changed divorce");

}

function separate(e, obj) {
    myDiagram.startTransaction("changed divorce");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var linkdata = contextmenu.data;
    // compute the next color for the node
    //console.log(linkdata.labelKeys);
    var node = obj.part.adornedPart;
    var diagram = node.diagram;
    var text = linkdata.labelKeys[0];
    var marriage_key = diagram.findNodeForKey(text);
    //console.log(JSON.stringify(marriage_key.data));
    var marriage = "Line1";
    var visible = true;
    var width = 15;
    var height = 20;
    var angle = 0;
    var strokeDashArray = [0, 0];
    myDiagram.model.setDataProperty(marriage_key.data, "adopt", marriage);
    myDiagram.model.setDataProperty(marriage_key.data, "visible", visible);
    myDiagram.model.setDataProperty(marriage_key.data, "width", width);
    myDiagram.model.setDataProperty(marriage_key.data, "height", height);
    myDiagram.model.setDataProperty(marriage_key.data, "angle", angle);
    myDiagram.model.setDataProperty(linkdata, "strokeDashArray", strokeDashArray);
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.commitTransaction("changed divorce");

}

function liveTogether(e, obj) {
    myDiagram.startTransaction("changed liveTogether");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var linkdata = contextmenu.data;
    // compute the next color for the node
    //console.log(linkdata.labelKeys);
    var node = obj.part.adornedPart;
    var diagram = node.diagram;
    var text = linkdata.labelKeys[0];
    var marriage_key = diagram.findNodeForKey(text);
    //console.log(JSON.stringify(marriage_key.data));
    var marriage = "Circle";
    var visible = false;
    var width = 1;
    var height = 1;
    var angle = 0;
    var strokeDashArray = [5, 2];
    myDiagram.model.setDataProperty(marriage_key.data, "adopt", marriage);
    myDiagram.model.setDataProperty(marriage_key.data, "visible", visible);
    myDiagram.model.setDataProperty(marriage_key.data, "width", width);
    myDiagram.model.setDataProperty(marriage_key.data, "height", height);
    myDiagram.model.setDataProperty(marriage_key.data, "angle", angle);
    myDiagram.model.setDataProperty(linkdata, "strokeDashArray", strokeDashArray);
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.commitTransaction("changed liveTogether");
}



function mode(draw) {
    var tool = myDiagram.toolManager.findTool("FreehandDrawing");
    tool.isEnabled = draw;
}

function updateAllAdornments() {  // called after checkboxes change Diagram.allow...
    myDiagram.selection.each(function (p) { p.updateAdornments(); });
}


//懷孕
function changePregnancy(e, obj) {
    myDiagram.startTransaction("changed Pregnancy");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var nodedata = contextmenu.data;
    // compute the next color for the node
    if (nodedata.sex === "F") {
        var pregnancy ;
        var visible = true;
        if (nodedata.color === "black") {
            var stroke = "white"
        }
        else {
            stroke = "black"
        }
        if (nodedata.pregnancy === "P" || nodedata.pregnancy === "" || nodedata.pregnancy === undefined) {
            switch (nodedata.pregnancy) {
                case "P": pregnancy = ""; break;
                case "": pregnancy = "P"; break;
                case undefined: pregnancy = "P"; break;
            }
        }
        else {
            pregnancy = nodedata.pregnancy;
            swal({
                title: "警告!",
                text: "此功能與多個體互斥",
                type: "warning"
            });
        }
    }
    else {
        swal({
            title: "警告!",
            text: "此角色無法懷孕",
            type: "warning"
        });
    }
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.model.setDataProperty(nodedata, "pregnancy", pregnancy);
    myDiagram.model.setDataProperty(nodedata, "stroke", stroke);
    myDiagram.commitTransaction("changed Pregnancy");
}

//多個體
function changeIndividual(e, obj) {
    myDiagram.startTransaction("changed Individual");
    // get the context menu that holds the button that was clicked
    var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    var nodedata = contextmenu.data;
    // compute the next color for the node
    var visible = true;
    // var editable = true;
    var individual = document.getElementById("n_type").value;
    switch (nodedata.pregnancy) {
        case "P": individual = "P", visible = true; break;
        case "3": individual = "", visible = false; break;
        case "": individual = "3", visible = true; break;
        case undefined: individual = "3", visible = true; break;
    }

    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
    myDiagram.model.setDataProperty(nodedata, "pregnancy", individual);
    myDiagram.commitTransaction("changed Individual");
}

function changeGender(obj) {
    myDiagram.startTransaction("changed Gender");
    // get the context menu that holds the button that was clicked
    //var contextmenu = obj.part;
    // get the node data to which the Node is data bound
    //var nodedata = contextmenu.data;
    // compute the next color for the node
    var gender_figure;
    var newcolor = "white";
    if (document.getElementById("gendermale").checked) {
        gender_figure = "Square";
    }
    if (document.getElementById("genderfemale").checked) {
        gender_figure = "Circle";
    }
    if (document.getElementById("genderbaby").checked) {
        gender_figure = "Triangle";
    }
    if (document.getElementById("genderunknown").checked) {
        gender_figure = "Diamond";
    }
    console.log(obj)
        switch (gender_figure) {
            case "Circle": figure = "Circle"; sex = "F"; break;
            case "Triangle": figure = "Triangle"; sex = "Baby"; break;
            case "Diamond": figure = "Diamond"; sex = "Unknown"; break;
            case "Square": figure = "Square"; sex = "M"; break;
        }
    // modify the node data
    // this evaluates data Bindings and records changes in the UndoManager
        console.log(obj)
    myDiagram.model.setDataProperty(obj,"figure",figure);
    myDiagram.model.setDataProperty(obj, "sex", sex);
    myDiagram.model.setDataProperty(obj, "fill", "white");
    myDiagram.model.setDataProperty(obj, "color", newcolor);
    myDiagram.model.setDataProperty(obj, "color_visible", false);
    myDiagram.model.setDataProperty(obj, "pregnancy", "");
    myDiagram.commitTransaction("changed Gender");
}

function changeRelationship(e, obj) {
    myDiagram.startTransaction("changed adoptinto");
    var contextmenu = temObj.part;
    var linkdata = contextmenu.data;
    var currentDiagram = contextmenu.diagram
    var linktobjedctkey = contextmenu.Vd.to;
    var adoptintoObject = currentDiagram.findNodeForKey(linktobjedctkey)
    var node = temObj.part.adornedPart;
    var diagram = node.diagram;
    var strokeDashArray;
    var adoptinto;
    var adoptinto_visible = true;



    if (document.getElementById("rel_biologic").checked) {
        strokeDashArray = [0, 0];
        adoptinto = "";
    }
    if (document.getElementById("rel_adoptinto").checked) {
        strokeDashArray = [5, 2];
        adoptinto = "[    ]";
    }
    if (document.getElementById("rel_adoptout").checked) {
        strokeDashArray = [0, 0];
        adoptinto = "[    ]";
    }
    switch (strokeDashArray) {
        case[0, 0]: strokeDashArray = [0, 0]; if (adoptinto = "") adoptinto = ""; born = "biologic"; break;
        case[5, 2]: strokeDashArray = [5, 2]; if (adoptinto = "[    ]") adoptinto = "[    ]"; born = "adoptinto"; break;
        case[0, 0]: strokeDashArray = [0, 0]; if (adoptinto = "[    ]") adoptinto = "[    ]"; born = "adoptout"; break;
    }


    myDiagram.model.setDataProperty(adoptintoObject.data, "adoptinto", adoptinto);
    myDiagram.model.setDataProperty(linkdata, "strokeDashArray", strokeDashArray);
    myDiagram.commitTransaction("changed adoptinto");
}

function changeRelationship(e, obj) {
    myDiagram.startTransaction("changed adoptinto");
    var contextmenu = temObj.part;
    var linkdata = contextmenu.data;
    var currentDiagram = contextmenu.diagram
    var linktobjedctkey = contextmenu.Vd.to;
    var adoptintoObject = currentDiagram.findNodeForKey(linktobjedctkey)
    var node = temObj.part.adornedPart;
    var diagram = node.diagram;
    var strokeDashArray;
    var adoptinto;
    var adoptinto_visible = true;



    if (document.getElementById("rel_biologic").checked) {
        strokeDashArray = [0, 0];
        adoptinto = "";
    }
    if (document.getElementById("rel_adoptinto").checked) {
        strokeDashArray = [5, 2];
        adoptinto = "[    ]";
    }
    if (document.getElementById("rel_adoptout").checked) {
        strokeDashArray = [0, 0];
        adoptinto = "[    ]";
    }
    switch (strokeDashArray) {
        case[0, 0]: strokeDashArray = [0, 0]; if (adoptinto = "") adoptinto = ""; born = "biologic"; break;
        case[5, 2]: strokeDashArray = [5, 2]; if (adoptinto = "[    ]") adoptinto = "[    ]"; born = "adoptinto"; break;
        case[0, 0]: strokeDashArray = [0, 0]; if (adoptinto = "[    ]") adoptinto = "[    ]"; born = "adoptout"; break;
    }


    myDiagram.model.setDataProperty(adoptintoObject.data, "adoptinto", adoptinto);
    myDiagram.model.setDataProperty(linkdata, "strokeDashArray", strokeDashArray);
    myDiagram.commitTransaction("changed adoptinto");
}