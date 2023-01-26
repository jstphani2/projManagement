/* 
 * To change this License header, choose License Headers in Projectt Properties,
 * To change this template file,choose Tools | Templates
 * and open the template in the editor
 */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML ="/api/iml";
var prjDBName = "PRJ-DB";
var prjRelationName = "PRJData";
var connToken ="90932284|-31949271168309265|90954048";

$("prjid").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj(){
    var prjid=$("#prjid").val();
    var jsonStr = {
        id: prjid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#prjname").val(record.name);
    $("#prjassignedto").val(record.salary);
    $("#assignmentdate").val(record.hra);
    $("#deadline").val(record.da);
   
}

function resetForm() {
    $("#prjid").val("");
    $("#prjname").val("");
    $("#prjassignedto").val("");
    $("#assignmentdate").val("");
    $("#deadline").val("");
  
    $("#empid").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#empid").focus();
}

function validateData() {
    var prjid, prjname, prjassignedto, assignmentdate,assignmentdate;
    prjid = $("#prjid").val();
    prjname= $("#prjname").val("");
    assignedto= $("#prjassignedto").val("");
    assignmentdate = $("#assignmentdate").val("");
    deadline = $("#deadline").val("");
  
    
    if (prjid=== ""){
        alert("Project ID missing");
        $("#empid").focus();
        return "";
    }
    if (prjname=== ""){
        alert("Project Name missing");
        $("#empname").focus();
        return "";
    }
    if (assignedto=== ""){
        alert("Assigned To missing");
        $("#empid").focus();
        return "";
    }
    if (assignmentdate=== ""){
        alert("Assignment date missing");
        $("#assignmentdate").focus();
        return "";
    }
    if (deadline=== ""){
        alert("DEADLINE missing");
        $("#deadline").focus();
        return "";
    }
    
    var jsonStrObj = {
        id: prjid,
        name: prjname,
        assignedto: prjassignedto,
        assignmentdate: assignmentdate,
        deadline: deadline
        
    };
    return JSON.stringify(jsonStrObj);
}

function getEmp(){
    var prjIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, prjDBName, prjRelationName, prjIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status===400) {
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#prjname").focus();
    } else if (resJsonObj.status===200){
        
        $("#empid").prop("disabled",true);
        fillData(resJsonObj);
        
        $("#change").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#prjname").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if (jsonStrObj==="") {
        return "";
    }
    var putRequest = createPUTRequest(connToken,jsonStrObj,prjDBName,prjRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#empid").focus();
}

function changeData(){
    $("change").prop("disabled",true);
    jsonChg=validdateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,prjDBName,prjRelationName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#prjid").focus();
}