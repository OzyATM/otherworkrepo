function getRadio(obj) {

    myDiagram.startTransaction("commit");
    var commit = obj.part;
    var nodedata = commit.part;
    var insertdata = commit.data;
    var bolddata = nodedata.data.bold;
    var sizedata = nodedata.data.fontsize;
    var fontstyle = nodedata.data.fontstyle;
    if (bolddata) {
        var bold = "bold ";
        document.getElementById("bold").style.backgroundColor = "#ff8c00"
    }
    else {
        var bold = " ";
        document.getElementById("bold").style.backgroundColor = "white"
    };
    var Italicdata = nodedata.data.Italic;
    if (Italicdata) {
        var Italic = "Italic ";
        document.getElementById("italic").style.backgroundColor = "#ff8c00"
    }
    else {
        var Italic = " ";
        document.getElementById("italic").style.backgroundColor = "white"
    };
    if (sizedata) {
        var size = nodedata.data.fontsize + "pt ";
    }
    else {
        var size = "12pt ";
        nodedata.data.fontsize = 12;
    };
    switch (fontstyle) {
        case "新細明體":
            fontstyle = "PMingLiU";
            break;
        case "細明體":
            fontstyle = "MingLiU";
            break;
        case "標楷體":
            fontstyle = "DFKai-SB";
            break;
        case "黑體":
            fontstyle = "SimHei";
            break;
        case "宋體":
            fontstyle = "SimSun";
            break;
        case "新宋體":
            fontstyle = "NSimSun";
            break;
        case "仿宋":
            fontstyle = "FangSong";
            break;
        case "楷體":
            fontstyle = "KaiTi";
            break;
        case "微軟正黑體":
            fontstyle = "Microsoft JhengHei";
            break;
        case "微軟雅黑體":
            fontstyle = "Microsoft YaHei";
            break;
        default:
            fontstyle = "PMingLiU"
    }

    //var type = "Helvetica, Arial, sans-serif";
    var font = ''.concat(Italic, bold, size, fontstyle);
    myDiagram.model.setDataProperty(insertdata, "font", font);
    myDiagram.commitTransaction("commit");
}