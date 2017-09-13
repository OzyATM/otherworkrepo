﻿var goObject = go.GraphObject.make;
// *******************************************************
//      Logic to Render data Unit Conversion
// *******************************************************
// Note: This part of the code handles converting logical
// data that is understandble by human into data that makes
// sense to our rendering engine, below are the current
// format of each model
// *******************************************************
// Generate NodeData based on data storage
// Node data contains:
//  - id
//  - patient
//  - gender
//  - containGen
//  - hasSameDisease
//  - isPragnent
//  - multiInvididualText
//  - isDead
//  - isAdopted
//  - notes (array)

function getNodeData(inputData, pos) {
    // Make sure no pointers is used in this method
    var tempNode = {
        key: inputData.id,
        mainFigure: getGenderShape(inputData.gender),
        isPatient: inputData.isPatient,
        fill: getSameDiseaseNodeFill(inputData.hasSameDisease),
        containGenVisible: inputData.containGen,
        isPVisable: inputData.isPragnent,
        colorForP: getPregantTextColor(inputData.hasSameDisease, inputData.containGen),
        textForMultiIndividual: inputData.multiInvididualText,
        isMultiIndividualVisable: getMultiTextVisibility(inputData.multiInvididualText),
        deadSymbolVisible: inputData.isDead,
        noteOne: inputData.notes[0],
        noteTwo: inputData.notes[1],
        noteThree: inputData.notes[2],
        isAdoptedSignVisible: inputData.isAdopted,
        loc: getPosString(pos),
        isDeleteBtnVisible: inputData.canBeDeleted,
        isAddParentBtnVisible: !getParentBtnVisibility(inputData),
        isPregnantBtnVisible: getPregantBtnVisibility(inputData.multiInvididualText, inputData.gender),
        isMultiInvididualTextBtnVisible: getMultiInvididualTextBtnVisibility(inputData.isPragnent)
    }
    return tempNode;
}

function getPosString(pos, offSet) {
    return "" + pos.x + " " + pos.y;
}

function getPosFromString(posString) {
    var res = posString.split(" ");
    var resX = Number(res[0]);
    var resY = Number(res[1]);
    return { x: resX, y: resY };
}

function getGenderShape(gender) {
    if (gender === "male") {
        return "Square";
    } else if (gender === "female") {
        return "Circle";
    } else if (gender === "unknown") {
        return "Diamond"
    } else if (gender === "baby") {
        return "Triangle"
    }
}

function getSameDiseaseNodeFill(sameDisease) {
    if (!sameDisease) {
        return "transparent"
    } else {
        return "black"
    }
}

function getPregantTextColor(sameDisease, containGen) {
    if (sameDisease || containGen) {
        return "white";
    } else {
        return "black";
    }
}

function getMultiTextVisibility(multiText) {
    if (multiText === "") {
        return false;
    } else {
        return true;
    }
}

function getParentBtnVisibility(inputData) {
    if (inputData.left || inputData.right || inputData.isPatient)
        return true;
    else
        return false;
}

function getPregantBtnVisibility(multiText, gender) {
    if (multiText != "" || gender === "male") {
        return false;
    }
    else {
        return true;
    }
}

function getMultiInvididualTextBtnVisibility(isPragnent) {
    if (isPragnent) {
        return false;
    } else {
        return true;
    }
}