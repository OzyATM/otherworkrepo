// When the blob is complete, make an anchor tag for it and use the tag to initiate a download
// Works in:
// * Chrome
// * IE11, Edge
// * Firefox
function myCallback(blob) {
    var url = window.URL.createObjectURL(blob);
    var filename = "familytree.png";

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    // IE 11
    if (window.navigator.msSaveBlob !== undefined) {
        window.navigator.msSaveBlob(blob, filename);
        return;
    }

    document.body.appendChild(a);
    requestAnimationFrame(function () {
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    });
}

function makeBlob() {
    var blob = myDiagram.makeImageData({ background: "white", returnType: "blob", callback: myCallback });
}