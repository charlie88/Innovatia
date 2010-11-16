var removeString = "Are you sure you wish to remove this item and associated data?";

function logAction(action) {}

function pollServer() {
	$.get("poll.php", function(data){
		if (data != null && data != '') {
			showResponses( data, true);
			if (!($("#noteTab").is(":hidden"))) {
				showNotes();
			}
		}
	});
}

function showLoading(selector) {
	$(selector).html("<div class='loadingAnim'></div>");
}

function subscribeForChild(child) {
	loadIdeaPopupData();
}

function loadIdeaPopupData() {
	if(!($("#ideaMission").is(":hidden")))
		getMission("ideaMission",currentIdeaId);
	else if (!($("#ideaFeatures").is(":hidden")))
		getFeaturesForm("ideaFeatures",currentIdeaId);
	else if (!($("#ideaRoles").is(":hidden")))
		getRolesForm("ideaRoles",currentIdeaId);
	else if (!($("#ideaFeatureEvaluationList").is(":hidden")))
		getFeatureEvaluationsForIdea();
	else if (!($("#ideaComments").is(":hidden")))
		getCommentsForIdea();
	else if (!($("#ideaAttachments").is(":hidden")))
		getAttachments();
	else if (!($("#ideaShare").is(":hidden")))
		getShareForIdea();
	else if (!($("#ideaSelect").is(":hidden")))
		getSelectForIdea();
	else if (!($("#ideaRiskEval").is(":hidden")))
		getRiskEvalForIdea("ideaRisks",currentIdeaId);
}

function loadPopupShow() {
	dijit.byId('ideasPopup').show();
	$("span#ideaName").load("ideas.ajax.php?action=getIdeaName&actionId="+currentIdeaId, function() { 
		loadIdeaPopupData();
	});
}

function printIdea(id) {
	var sendId;
	if (id != null && id != undefined) {
		sendId = id;
	} else {
		sendId = currentIdeaId;
	}
	newWin = window.open("compare.ajax.php?action=getIdeaSummary&actionId=" + sendId);
	newWin.print();
}

function getMission(formId,actionId) { 
	showLoading("#"+formId);
	$.get("ideas.ajax.php?action=getMission&actionId=" + actionId, function (data) {
		$("#"+formId).html(data);
		dojo.parser.instantiate(dojo.query('#' + formId + ' *'));
		$('#' + formId).find("textarea").blur(function() {
			updateIdeaDetails("#ideadetails_form_"+currentIdeaId);
		});
	});
}

function getFeaturesForm(formId,actionId) {
	showLoading("#"+formId);
	$.get("ideas.ajax.php?action=getFeaturesForm&actionId=" + actionId, function (data) {
		$("#"+formId).html(data);
		dojo.parser.instantiate(dojo.query('#' + formId + ' *'));
		$("#featureTable_" + currentIdeaId + " tr").each(function() {
			var fId = $(this).attr("id");
			$(this).find(":input").blur(function() {
				updateFeature(fId);
			});
		});
	});
}

function getRolesForm(formId,actionId) {
	showLoading("#"+formId);
	$.get("ideas.ajax.php?action=getRolesForm&actionId=" + actionId, function (data) {
		$("#"+formId).html(data);
		dojo.parser.instantiate(dojo.query('#' + formId + ' *'));
		$("#idearoles_" + currentIdeaId + " table tr").each(function() {
			var fId = $(this).attr("id");
			$(this).find(":input").blur(function() {
				updateRole(fId);
			});
		});
	});
}

function getFeatures(formId,actionId) {
	showLoading("#"+formId);
	$.get("ideas.ajax.php?action=getFeatures&actionId=" + actionId, function (data) {
		$("#"+formId).html(data);
		dojo.parser.instantiate(dojo.query('#' + formId + ' *'));
	});
}

function getRoles(formId,actionId) {
	showLoading("#"+formId);
	$.get("ideas.ajax.php?action=getRoles&actionId=" + actionId, function (data) {
		$("#"+formId).html(data);
		dojo.parser.instantiate(dojo.query('#' + formId + ' *'));
	});
}

//////////// MENU ///////////
function showIdeaReviews(ideaId) {
	currentIdeaId = ideaId;
	dijit.byId("ideasPopupReview").selectChild(dijit.byId("ideaComments"));
	dijit.byId("ideasPopupTabContainer").selectChild(dijit.byId("ideasPopupReview"));
	loadPopupShow();
}
 
function showIdeaSummary(id) {
	var idea = new dijit.Dialog({href:"compare.ajax.php?action=getIdeaSummary&actionId="+id});
	dojo.body().appendChild(idea.domNode);
	idea.startup();
	idea.show();
}

function showProfileSummary(id) {
	var profile = new dijit.Dialog({href:"profile.ajax.php?action=getProfileSummary&actionId="+id});
	dojo.body().appendChild(profile.domNode);
	profile.startup();
	profile.show();
}

function showIdeaDetails(ideaId) { 
	currentIdeaId = ideaId;
	loadPopupShow();
}

///// GROUP SELECTION////////////
function showIdeaGroupsForUser() {
	$.get("ideas.ajax.php?action=getIdeaGroupsForUser", function (data) {
		$(".ideaGroupsList").html(data);
		//dojo.parser.instantiate(dojo.query("div.ideaGroupsSel *"));
		//dojo.parser.instantiate(dojo.query("div.ideaGroupsSel"));
		//$("button span.dijitButtonText").html(currentGroupName);
		$(".ideaGroupsList div p a").removeClass("selected");
		if (currentGroupName == "Public") {
			$(".ideaGroupsList div p a.public").addClass("selected");
		} else if (currentGroupName == "Private") {
			$(".ideaGroupsList div p a.private").addClass("selected");
		} else {
			$(".ideaGroupsList div p a.groupSel_"+currentGroupId).addClass("selected");
		}
	});
}

function showStuffForTab() {
	if (!($("#ideaTab").is(":hidden"))) {
		getIdeas();
	} else if (!($("#compareTab").is(":hidden"))){
		getCompare();
	} else if (!($("#selectTab").is(":hidden"))) {
		getSelect();
	}
}

function showDefaultIdeas() {
	currentGroupId = null;
	currentGroupName = "Private";
	showStuffForTab();
	showIdeaGroupsForUser();
}

function showPublicIdeas() {
	currentGroupId = null;
	currentGroupName = "Public";
	showStuffForTab();
	showIdeaGroupsForUser();
}

function showIdeasForGroup(gId, elem) {
	currentGroupId = gId;
	currentGroupName = elem;
	showStuffForTab();
	showIdeaGroupsForUser();
}

///////////// GET FUNCTIONS ///////////////

function getNotes() {
	showLoading("#noteTab");
	$("#noteTab").load("notes.php");
}

function getDash() {
	showLoading("#dashTab");
	$("#dashTab").load("dash.php");
}

function getIdeas() {
	showLoading("#ideasList");
	if (currentGroupId == null && currentGroupName == "Private") {
		$.get("ideas.ajax.php?action=getIdeas", function (data) {
			$("#ideasList").html(data);
		});
		$("#addIdeaForm span").html("Add new idea");
		$("#addIdeaTitle").show();
	} else if (currentGroupId == null && currentGroupName == "Public") {
		$.get("ideas.ajax.php?action=getPublicIdeas", function (data) {
			$("#ideasList").html(data);
		});
		$("#addIdeaForm span").html("Make a private idea public");
		$("#addIdeaTitle").hide();
	} else { 
		$.get("ideas.ajax.php?action=getIdeasForGroup&groupId="+currentGroupId, function (data) {
			$("#ideasList").html(data);
		});
		$("#addIdeaForm span").html("Add a private idea to the group");
		$("#addIdeaTitle").hide();
	}
} 

function prepCompareTable() {
	initFormSelectTotals('table#riskEvaluation');
	$("table#riskEvaluation tr").each(function() { 
		var fId = $(this).attr("id");
		$(this).find(":input").blur(function() {
			updateRisk(fId);
		});
	});
}

function getCompare() {
	showLoading("#compareList");
	if (currentGroupId == null && currentGroupName == "Private") {
		$.get("compare.ajax.php?action=getComparison", function (data) {
			$("#compareList").html(data);
			prepCompareTable();
		});
	} else if (currentGroupId == null && currentGroupName == "Public") {
		$.get("compare.ajax.php?action=getPublicComparison", function (data) {
			$("#compareList").html(data);
			prepCompareTable();
		});
	} else { 
		$.get("compare.ajax.php?action=getComparisonForGroup&groupId="+currentGroupId, function (data) {
			$("#compareList").html(data);
			prepCompareTable();
		});
	}
	getCompareComments();
}

function getSelect() {
	showLoading("#selectList");
	if (currentGroupId == null && currentGroupName == "Private") {
		$("#selectList").load("select.ajax.php?action=getSelection");
	} else if (currentGroupId == null && currentGroupName == "Public") {
		$("#selectList").load("select.ajax.php?action=getPublicSelection");
	} else {
		$("#selectList").load("select.ajax.php?action=getSelectionForGroup&actionId="+currentGroupId);
	}
}

function getProfile() {
	showLoading("#profileTab");
	$.get("profile.ajax.php?action=getProfile", function (data) {
		$("#profileTab").html(data);
		dojo.parser.instantiate(dojo.query('#profileTab *'));
		$("#profileDetailsForm").find(":input").each(function() {
			$(this).blur(function() {
				updateProfile("profileDetailsForm");
			});
		});
	});
}

function getGroups() {
	showLoading("#groupsList");
	$.get("groups.ajax.php?action=getGroups", function (data) {
		$("#groupsList").html(data);
		showIdeaGroupsForUser();
	});
	
	if (currentGroupId != null)
		showGroupDetails();
}

function getReports() {
	showLoading("#reportList");
	$.get("reports.ajax.php?action=getReportDetails", function (data) {
		$("#reportDetails").html(data);
		$.get("reports.ajax.php?action=getReportGraphs", function (data) {
			$("#reportList").html(data);
		});
	});
}

function getSearch() {
	var searchTerms = $("#searchInput").val();
	showLoading("#searchTab #searchResults");
	url = "search.php";
	if (searchTerms != undefined)
		url += "?searchTerms="+searchTerms; 
	$("#searchTab #searchResults").load(url);
}

function getAdmin(){}

function getAttachments() {
	showLoading("#ideaAttachments");
	$("#ideaAttachments").load("ideas.ajax.php?action=getAttachments&actionId="+currentIdeaId);
}

function getRiskEvalForIdea() {
	showLoading("#ideaRiskEval");
	$("#ideaRiskEval").load("compare.ajax.php?action=getRiskEvalForIdea&actionId="+currentIdeaId, function() {
		$("#ideaRiskEvalDetails").find(":input").each(function() {
			$(this).blur(function() {
				updateRisk("ideaRiskEvalDetails");
			});
		});
	});
}

function getShareForIdea() {
	showLoading("#ideaShare");
	$("#ideaShare").load("groups.ajax.php?action=getShareForIdea&actionId="+currentIdeaId);
}

function getSelectForIdea() {
	showLoading("#ideaSelect");
	$("#ideaSelect").load("select.ajax.php?action=getSelectForIdea&actionId="+currentIdeaId, function () {
		dojo.parser.instantiate(dojo.query('#ideaSelectDetails *')); 
		$("#ideaSelectDetails").find(":input").each(function() {
			$(this).blur(function() {
				updateSelection("ideaSelectDetails");
			});
		});
	});
}

function showSearch() {
	$(".menulnk").parent().removeClass("selMenu");
	$("#searchlnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#searchlnk").addClass("selLnk");
	getSearch();
	$(".tabBody").hide();
	$("#searchTab").show();	
}

function showIdeas(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#ideaslnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#ideaslnk").addClass("selLnk");
	getIdeas();
	showIdeaGroupsForUser();
	$(".tabBody").hide();
	$("#ideaTab").show();
}

function showReports(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#reportslnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#reportslnk").addClass("selLnk");
	getReports();
	$(".tabBody").hide();
	$("#reportTab").show();
}	

function showProfile(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#profilelnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#profilelnk").addClass("selLnk");
	getProfile();
	$(".tabBody").hide();
	$("#profileTab").show();
}

function showGroups(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#groupslnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#groupslnk").addClass("selLnk");
	getGroups(); 
	$(".tabBody").hide();
	$("#groupTab").show();
}

function showCompare(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#comparelnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#comparelnk").addClass("selLnk");
	getCompare();
	showIdeaGroupsForUser();
	$(".tabBody").hide();
	$("#compareTab").show();
}

function showSelect(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#selectlnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#selectlnk").addClass("selLnk");
	getSelect();
	showIdeaGroupsForUser();
	$(".tabBody").hide();
	$("#selectTab").show();	
}

function showDash(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#dashlnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#dashlnk").addClass("selLnk");
	getDash();
	$(".tabBody").hide();
	$("#dashTab").show();
}

function showAdmin(elem) {	
	$(".menulnk").parent().removeClass("selMenu");
	$("#adminlnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#adminlnk").addClass("selLnk");
	getAdmin();
	$(".tabBody").hide();
	$("#adminTab").show();	
}

function showTimelines(elem) {
	$(".menulnk").parent().removeClass("selMenu");
	$("#timelinelnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#timelinelnk").addClass("selLnk");
	$("#timelineTab").load("timeline.php");
	$(".tabBody").hide();
	$("#timelineTab").show();	
}

function showNotes() {
	$(".menulnk").parent().removeClass("selMenu");
	$("#noteslnk").parent().addClass("selMenu");
	$(".menulnk").removeClass("selLnk");
	$("#noteslnk").addClass("selLnk");
	getNotes();
	$(".tabBody").hide();
	$("#noteTab").show();
}

function showFeedback(elem) {
	window.open("mailto:james.hornitzky@uts.edu.au");
}

/////// COMMON FUNCTIONS ///////
function setFormArrayValue(key,val) {
	formArray[key] = val;
}

function getInputDataFromId(selector) {
	formArray=new Array();
	$("#" + selector + " :input").each(function(index, formArray) {
		if ($(this).attr('name') != null && $(this).attr('name') != '') 
			setFormArrayValue($(this).attr('name'),$(this).val());
	}); 
	return formArray;
}

function getSerializedArray(array) {
	var a = [];
	for (key in array) {
	    a.push(key+"="+array[key]);
	}
	return a.join("&") 
}

function showDetails(id) {
	$("#" + id).toggle();
}

function logout() {
	window.location.href = serverRoot + "?logOut=1";
}

function showResponses(data, timeout) {
	var selector;
	if (dijit.byId("ideasPopup").open)  
		selector = "#ideaPopupResponses"; 
	else 
		selector = "#ideaResponses"; 
	$(selector).html(data);
	$(selector).slideDown();
	if (timeout) {
		if (ctime != null)
			window.clearTimeout(ctime);
		ctime = window.setTimeout('hideResponses("'+selector+'")', 10000);
	} 
}

function hideResponses() {
	$(".responses").slideUp(function () {
		$(".responses").empty();
	});
}

function showHelp(text) {
	$('#commonPopup #actionDetails').empty();
	$('#commonPopup #actionDetails').html(text);
	dijit.byId('commonPopup').show();
}

//Add another contains method
jQuery.expr[':'].Contains = function(a,i,m){
  return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
};

function filterIdeas(element) {
	var filter = $(element).val();
  if (filter != '' && filter != null) { 
    $("#ideasList .idea .formHead").find(".ideatitle:not(:Contains('" + filter + "'))").parent().parent().slideUp();
    $("#ideasList .idea .formHead").find(".ideatitle:Contains('" + filter + "')").parent().parent().slideDown();
  } else {
    $("#ideasList .idea .formHead").find(".ideatitle").parent().parent().slideDown();
  }
	
}

function initFormSelectTotals(selector, parentSelector) {
	$(selector + " tr").each(function(index, element) {
		var initFormId = $(element).attr("id");
		if (initFormId != null && initFormId != ''){
			$(element).find("select").change(function () {
				var x = initFormId;
				updateFormSelectTotals(x);
				updateFormTotal(parentSelector);
			}); 
			updateFormSelectTotals(initFormId);
			updateFormTotal(parentSelector);
		}
	}); 
}

function updateFormSelectTotals(formId) {
	var total = 0;
	var count = 0;
	$("#" + formId + " select").each(function(index) {
		if (!isNaN(parseInt($(this).val()))){
			total = total + parseInt($(this).val());
			count++;
		}
	}); 
	if (count != 0)
		$("#" + formId + " span.itemTotal").html(Math.round(total/count));
}

function updateFormTotal(formId) {
	var total = 0;
	var count = 0;
	$(formId).find("select").each(function(index) {
		if (!isNaN(parseInt($(this).val()))){
			total = total + parseInt($(this).val());
			count++;
		}
	}); 
	if (count != 0)
		$(formId + " span.evalTotal").html(Math.round(total/count));
}

function genericFormUpdate(target, element) {}

function genericFieldUpdate(target, element) {}

function addNote(element) {
	$.post("notes.ajax.php", $(element).serialize(), function(data) {
		showResponses( data, true);
		showNotes();
	});
}

/////// IDEA FUNCTIONS /////////
function addIdea(elem) {
	if(currentGroupId == null && currentGroupName == "Private") {
		$.post("ideas.ajax.php", $("#addIdeaForm").serialize(), function(data) {
			showResponses( data, true);
			getIdeas();
		});
	} else if(currentGroupId == null && currentGroupName == "Public") {
		showAddPublicIdea(elem);
	} else {
		showAddGroupIdea(elem);
	}
}

function deleteIdea(iId) {
	if (confirm("Are you sure you wish to delete this idea?")) {
		$.post("ideas.ajax.php", {action:"deleteIdea", ideaId:iId}, function (data) {
			showResponses( data, true);
			getIdeas();
		});
	}
}

function updateIdeaDetails(formId) {
	$.post("ideas.ajax.php", $(formId).serialize(), function (data) {
		showResponses( data, true);
	});
}

function showIdeaOptions(element) {}

function hideIdeaOptions(element) {}

function updateFeature(form) {
	formData = getInputDataFromId(form);
	formData['action'] = 'updateFeature';
	$.post("ideas.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
	});
}

function updateRole(form) {
	formData = getInputDataFromId(form);
	formData['action'] = 'updateRole';
	$.post("ideas.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
	});
}

function genericAdd(selector) {
	$.post("ideas.ajax.php", $("#"+selector).serialize(), function(data) {
		showResponses( data, true);
		getIdeas();
	});	
}

function genericDelete(target, id) {
	if (confirm(removeString)) {
		$.post("ideas.ajax.php", {actionId:id, action:target}, function(data) {
			showResponses( data, true);
			getIdeas();
		});		
	}
}

///////////////// GROUP ///////////////

function addGroup() {
	$.post("groups.ajax.php", $("#addGroupForm").serialize(), function(data) {
		showResponses( data, true);
		getGroups();
	});
}

function deleteGroup(gId) {
	if (confirm(removeString)) {
		$.post("groups.ajax.php", {action: "deleteGroup", groupId:gId}, function(data) {
		showResponses( data, true);
		if (gId == currentGroupId) {
			currentGroupId = null;
			$("#groupDetails").empty();
		}
		getGroups();
		});
	}
}

function showGroupDetails() {
	$.get("groups.ajax.php?action=getGroupDetails&actionId="+currentGroupId, function(data) {
		$("#groupDetails").html(data);
	});
}

function acceptGroup() {
	$.post("groups.ajax.php", {action: "acceptGroup", actionId:currentGroupId}, function(data) {
		showResponses( data, true);
		showGroupDetails();
	});
}

function updateForGroup(id,name) {
	currentGroupId = id;
	currentGroupName = name;
	showGroupDetails();
	showIdeaGroupsForUser();
}

function showAddGroupIdea(elem) {
	showCommonPopup(elem);
	$.get("groups.ajax.php?action=getAddIdea", function(data) {
		$("#actionDetails").html(data);
	});
}

function showAddPublicIdea(elem) {
	showCommonPopup(elem);
	$.get("groups.ajax.php?action=getPublicAddIdea", function(data) {
		$("#actionDetails").html(data);
	});
}

function showAddGroupUser(elem) {
	showCommonPopup(elem);
	$.get("groups.ajax.php?action=getAddUser", function(data) {
		$("#actionDetails").html(data);
	});
} 

function addUserToCurGroup(id) {
	dijit.byId('commonPopup').hide();
	$.post("groups.ajax.php", {action: "linkUserToGroup", userId:id, groupId:currentGroupId}, function(data) {
		showResponses( data, true);
		showGroupDetails();
	});
}

function addIdeaToGroup(id, gId) {
	dijit.byId('commonPopup').hide();
	$.post("groups.ajax.php", {action: "linkIdeaToGroup", ideaId:id, groupId:gId}, function(data) {
		showResponses( data, true);
		showGroupDetails();
	});
}

function addIdeaToCurGroup(id) {
	addIdeaToGroup(id, currentGroupId);
}

function addIdeaToPublic(id) {
	dijit.byId('commonPopup').hide();
	$.post("groups.ajax.php", {action: "addIdeaToPublic", actionId:id}, function(data) {
		showResponses(data, true);
		getIdeas();
	});
}

function refuseGroup() {
	$.post("groups.ajax.php", {action: "refuseGroup", actionId:currentGroupId}, function(data) {
		showResponses( data, true);
		currentGroupId = null;
		showGroupDetails();
	});
}

function requestGroup() {
	$.post("groups.ajax.php", {action: "requestGroup", actionId:currentGroupId}, function(data) {
		showResponses( data, true);
		showGroupDetails();
	});
}

function approveGroupUser(uId) {
	$.post("groups.ajax.php", {action: "approveGroupUser", actionId:currentGroupId, userId:uId}, function(data) {
		showResponses( data, true);
		showGroupDetails();
	});
}

function delUserFromCurGroup(id) {
	if (confirm("Are you sure you wish to remove the user from this group?")) {
		$.post("groups.ajax.php", {action: "unlinkUserToGroup", userId:id, groupId:currentGroupId}, function(data) {
			showResponses( data, true);
			showGroupDetails();
			getGroups();
		});
	}
}

function delIdeaFromGroup(id, gId) {
	if (confirm("Are you sure you wish to remove this idea from this group?")) {
		$.post("groups.ajax.php", {action: "unlinkIdeaToGroup", ideaId:id, groupId:gId}, function(data) {
			showResponses( data, true);
			showGroupDetails();
		});
	}
}

function delIdeaFromCurGroup(id) {
	delIdeaFromGroup(id, currentGroupId);
}

///////////// RISK EVALUATION /////////////

function showCommonPopup(elem) {
	var popup = dijit.byId('commonPopup');
	$('#commonPopup #actionDetails').empty();
	popup.show();	
	if (elem != undefined) {
		var elemInfo = dojo.position(elem, true);
		$("#commonPopup").animate({left: Math.floor(elemInfo.x) + "px",
        top: Math.floor(elemInfo.y + elemInfo.h) + "px"});
	}
}

function showAddRiskItem(elem) {
	showCommonPopup(elem);
	if (currentGroupId == null ) {
		$.get("compare.ajax.php?action=getAddRisk", function(data) {
			$("#commonPopup #actionDetails").html(data);
		});
	} else {
		$.get("compare.ajax.php?action=getAddRiskForGroup&groupId="+currentGroupId, function(data) {
			$("#commonPopup #actionDetails").html(data);
		});
	}
} 

function addRiskItem(id) {
	dijit.byId('commonPopup').hide();
	$.post("compare.ajax.php", {action: "createRiskItem", ideaId:id}, function(data) {
		showResponses( data, true);
		showCompare();
	});
}

function addRiskItemForGroup(id, groupId) {
	dijit.byId('commonPopup').hide();
	$.post("compare.ajax.php", {action: "createRiskItemForGroup", ideaId:id, groupId:groupId}, function(data) {
		showResponses( data, true);
		showCompare();
	});
}
 
function updateRisk(riskform){
	formData = getInputDataFromId(riskform);
	formData['action'] = 'updateRiskItem';
	$.post("compare.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
		showCompare();
	});
}

function deleteRisk(riskid){
	if (confirm("Are you sure you wish to remove this risk item?")) {
		$.post("compare.ajax.php", {action: "deleteRiskItem", riskEvaluationId:riskid}, function(data) {
			showResponses( data, true);
			showCompare();
		});
	}
}

///////////// REVIEWS /////////////////////
function getCommentsForIdea() {
	$.get("ideas.ajax.php?action=getCommentsForIdea&actionId="+currentIdeaId, function(data) {
		$("#commentList").html(data);
	});
}

function getCompareComments() {
	if (currentGroupId == null && currentGroupName == "Private") {
		$.get("compare.ajax.php?action=getCompareComments", function(data) {
			$("#compareCommentList").html(data);
			$("#addCompareCommentForm").show();
		});
	} else if (currentGroupId == null && currentGroupName == "Public") {
		/*$.get("compare.ajax.php?action=getPublicCompareComments", function(data) {
			$("#compareCommentList").html(data);
			$("#addCompareCommentForm").hide();
		});*/
		$("#compareCommentList").empty();
		$("#addCompareCommentForm").hide();
	} else { 
		$.get("compare.ajax.php?action=getCompareCommentsForGroup&actionId="+currentGroupId, function(data) {
			$("#compareCommentList").html(data);
			$("#addCompareCommentForm").show();
		});
	}
}

function getFeatureEvaluationsForIdea() {
	$.get("ideas.ajax.php?action=getIdeaFeatureEvaluationsForIdea&actionId="+currentIdeaId, function(data) {
		$("#ideaFeatureEvaluationList").html(data);
		dojo.parser.instantiate(dojo.query('#ideaFeatureEvaluationList *'));
		$(".featureEvaluation").each(function() { 
			$(this).find("table tr").each(function() {
				var fId = $(this).attr("id");
				$(this).find(":input").blur(function() {
					updateFeatureEvaluation(fId);
				});
			});
		});
	});
}

function addComment() {
	$.post("ideas.ajax.php", $("#addCommentForm").serialize()+"&ideaId="+currentIdeaId, function(data) {
		showResponses( data, true);
		getCommentsForIdea();
	});
}

function addCompareComment() {
	var urlAddition = "";
	if (currentGroupId)
		urlAddition = "&groupId="+currentGroupId;
	$.post("ideas.ajax.php", $("#addCompareCommentForm").serialize()+urlAddition, function(data) {
		showResponses( data, true);
		getCompareComments();
	});
}

function deleteComment(cid) {
	if (confirm(removeString)) {
		$.post("ideas.ajax.php", {action: "deleteComment", commentId:cid}, function(data) {
			showResponses( data, true);
			if (dijit.byId("ideasPopup").open)
				getCommentsForIdea();
			else	
				getCompareComments();
		}); 
	}
}

function addFeatureItem(fId, evalId) {
	$.post("ideas.ajax.php", {action: "createFeatureItem", featureId: fId, ideaFeatureEvaluationId:evalId}, function(data) {
		showResponses( data, true);
		getFeatureEvaluationsForIdea();
	});
}
 
function updateFeatureItem(featureItemId,featureForm){
	formData = getInputDataFromId(featureForm);
	formData['action'] = 'updateFeatureItem';
	$.post("ideas.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
	});
}

function deleteFeatureItem(fid){
	if (confirm(removeString)) {
	$.post("ideas.ajax.php", {action: "deleteFeatureItem", featureEvaluationId:fid}, function(data) {
		showResponses( data, true);
		getFeatureEvaluationsForIdea();
	});
	}
}

function addFeatureEvaluation(selector) {
	$.post("ideas.ajax.php", $("#"+selector).serialize(), function(data) {
		showResponses( data, true);
		getFeatureEvaluationsForIdea();
	});
}
 
function updateFeatureEvaluation(featureForm){
	formData = getInputDataFromId(featureForm);
	formData['action'] = 'updateFeatureEvaluation';
	$.post("ideas.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
	});
}

function deleteFeatureEvaluation(fid){
	if (confirm(removeString)) {
	$.post("ideas.ajax.php", {action: "deleteFeatureEvaluation", featureEvaluationId:fid}, function(data) {
		showResponses( data, true);
		getFeatureEvaluationsForIdea();
	});
	}
}

function updateProfile(form) {
	formData = getInputDataFromId(form);
	formData['action'] = 'updateProfile';
	$.post("profile.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
	});
}

//////////////// SELECTIONS ////////////////
function showAddSelectIdea(elem) {
	showCommonPopup(elem);
	if (currentGroupId == null ) {
		$.get("select.ajax.php?action=getAddSelect", function(data) {
			$("#commonPopup #actionDetails").html(data);
		});
	} else {
		$.get("select.ajax.php?action=getAddSelectForGroup&groupId="+currentGroupId, function(data) {
			$("#commonPopup #actionDetails").html(data);
		});
	}
} 

function addSelectItem(id) {
	dijit.byId('commonPopup').hide();
	$.post("select.ajax.php", {action: "createSelection", ideaId:id}, function(data) {
		showResponses( data, true);
		showSelect();
	});
}

function deleteSelectIdea(id){
	if (confirm(removeString)) {
	$.post("select.ajax.php", {action: "deleteSelection", selectionId:id}, function(data) {
		showResponses( data, true);
		showSelect();
	});
	}
}

function updateSelection(selectform){
	formData = getInputDataFromId(selectform);
	formData['action'] = 'updateSelection';
	$.post("select.ajax.php", getSerializedArray(formData), function(data) {
		showResponses( data, true);
		showCompare();
	});
}

function printIdea(id) {
	genericPrint("compare.ajax.php?action=getIdeaSummary&actionId=", id);
}

function printGroup() {
	genericPrint("groups.ajax.php?action=getGroupDetails&actionId=", currentGroupId);
}

function genericPrint(url, id) {
	var sendId;
	if (id != null && id != undefined) {
		sendId = id;
	} else {
		sendId = currentIdeaId;
	}
	newWin = window.open(url + sendId);
	newWin.print();
}