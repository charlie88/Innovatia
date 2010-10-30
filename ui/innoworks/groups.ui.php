<?
require_once("thinConnector.php");
import("group.service");

function renderDefault() {?>
<form id="addGroupForm" class="addForm ui-corner-all"
	onsubmit="addGroup(); return false;"><span>New Group</span> <input
	name="title" type="text" /> <input type="submit" value=" + "
	title="Create a group" /> <input type="hidden" name="action"
	value="addGroup" /></form>
<?
echo "<div>";
echo "<h3>My Groups</h3>";
$groups = getGroupsForCreatorUser($_SESSION['innoworks.ID']);
if ($groups && dbNumRows($groups) > 0 ) {
	while ($group = dbFetchObject($groups)) {
		renderGroup($groups,$group);
	}
} else {
	echo "<p>No groups</p>";
}
echo "</div>";

echo "<div>";
echo "<h3>Groups I'm part of</h3>";
$groups = getPartOfGroupsForUser($_SESSION['innoworks.ID']);
if ($groups && dbNumRows($groups) > 0 ) {
	while ($group = dbFetchObject($groups)) {
		renderPartOfGroups($groups,$group);
	}
} else {
	echo "<p>No groups that Im just part of</p>";
}
echo "</div>";

echo "<div>";
echo "<h3>Other Groups</h3>";
$groups = getOtherGroupsForUser($_SESSION['innoworks.ID']);
if ($groups && dbNumRows($groups) > 0 ) {
	while ($group = dbFetchObject($groups)) {
		renderOtherGroup($groups,$group);
	}
} else {
	echo "<p>No other groups</p>";
}
echo "</div>";
}

function renderGroup($groups, $group) {
	echo "<a href='javascript:updateForGroup(\"".$group->groupId."\",\"".$group->title."\")'>". $group->title . "</a>";
	echo "<input type='button' onclick='deleteGroup(" . $group->groupId .")' value=' - ' />";
}

function renderPartOfGroups($groups, $group) {
	echo "<a href='javascript:updateForGroup(\"".$group->groupId."\",\"".$group->title."\")'>". $group->title . "</a>";
}

function renderOtherGroup($groups, $group) {
	echo $group->title;
}

function renderDetails($currentGroupId) {
	
	$groups = getGroupWithId($currentGroupId, $_SESSION['innoworks.ID']);
	$groupUserEntry = getGroupUserEntryWithId($currentGroupId, $_SESSION['innoworks.ID']);

	$group;
	$groupUser;
	if ($groups && dbNumRows($groups) > 0)
	$group = dbFetchObject($groups);
	if ($groupUserEntry && dbNumRows($groupUserEntry) > 0)
	$groupUser = dbFetchObject($groupUserEntry);

	if ($group == null && $groupUser == null)
		die("No group exists");
	
	$userService = new AutoObject("user.service");

	if ($groupUser->approved == 0 && $groupUser->accepted == 1) {
		echo "You have asked for access to this group, but have not been approved. You can contact the lead " . $userService->getUserInfo($group->userId)->username . ".";
	} else if ($groupUser->approved == 1 && $groupUser->accepted == 0) {
		echo "You have not accepted your invitation. Click <a href='javascript:logAction()' onclick='acceptGroup();'>here</a> to accept or <a href='javascript:logAction()' onclick='refuseGroup();'>here</a> to turn down the invitation.";
	} else if (($groupUser->approved == 1 && $groupUser->accepted == 1) || $group->userId == $_SESSION['innoworks.ID']) {
		if ($groups && (dbNumRows($groups) == 1)) {
			echo "<h2> Details for ".$group->title."</h2>";

			echo "<h3>Users";
			if ($group->userId == $_SESSION['innoworks.ID'])
			echo "<input type='button' value=' + ' onclick='showAddGroupUser()'/>";
			echo "</h3>";
			$groupUsers = getUsersForGroup($currentGroupId);
			if ($groupUsers && dbNumRows($groupUsers) > 0) {
				echo "<ul>";
				while ($user = dbFetchObject($groupUsers)) {
					echo "<li>" . "<a href='javascript:showProfileSummary(\"$user->userId\")'>" . $user->username . "</a>";
					if ($group->userId == $_SESSION['innoworks.ID']) echo "<input type='button' value =' - ' onclick='delUserFromCurGroup($user->userId)'/>";
					echo "</li>";
				}
				echo "</ul>";
			} else {
				echo "<p>None</p>";
			}

			echo "<h3>Ideas<input type='button' value=' + ' onclick='showAddGroupIdea()'/></h3>";
			$groupIdeas = getIdeasForGroup($currentGroupId);
			if ($groupIdeas && dbNumRows($groupIdeas) > 0) {
				echo "<ul>";
				while ($idea = dbFetchObject($groupIdeas)) {
					echo "<li><a href=\"javascript:showIdeaDetails('$idea->ideaId')\" >" . $idea->title . "</a>";
					if ($idea->userId == $_SESSION['innoworks.ID']) echo "<input type='button' value =' - ' onclick='delIdeaFromCurGroup($idea->ideaId)'/>";
					echo "</li>";
				}
				echo "</ul>";
			} else {
				echo "<p>None</p>";
			}

			echo "<h3>Attachments</h3>";
			echo "<iframe style='width:100%;height:5em;' src='attachment.php?groupId=$group->groupId'></iframe>";
		} 
	} else {
		echo "<p>You have no access to this group. Please contact the lead. </p>";
	}
}

function renderAddUser() {
	import("user.service");
	echo "Select a user to add to group";
	$users = getAllUsers();
	if ($users && dbNumRows($users) > 0) {
		echo "<ul>";
		while ($user = dbFetchObject($users)) {
			echo "<li><a href='javascript:addUserToCurGroup(\"$user->userId\")'>".$user->username."</a></li>";
		}
		echo "</ul>";
	}
}

function renderAddIdea() {
	import("idea.service");
	echo "Select an idea to add to group";
	$ideas = getIdeas($_SESSION['innoworks.ID']);
	if ($ideas && dbNumRows($ideas) > 0) {
		echo "<ul>";
		while ($idea = dbFetchObject($ideas)) {
			echo  "<li><a href='javascript:addIdeaToCurGroup(\"$idea->ideaId\")'>".$idea->title. "</a></li>";
		}
		echo "</ul>";
	}
}


function renderIdeaRiskEval($ideaId, $userId) {
	import("compare.service");
	$item = getRiskItemForIdea($ideaId,$userId);
	if ($item && dbNumRows($item) > 0) {
		renderGenericInfoForm(array(), dbFetchObject($item), array("riskEvaluationId","groupId","userId","ideaId"));
		echo "Go to <a href='javascript:showCompare(); dijit.byId(\"ideasPopup\").hide()'>Compare</a> to edit data";
	} else {
		echo "<p>No compare data for idea</p>";
		echo "Go to <a href='javascript:showCompare(); dijit.byId(\"ideasPopup\").hide()'>Compare</a> to add comparison data";
	}
}

function renderIdeaShare($ideaId, $userId) {
	import("group.service");
	$item = getIdeaShareDetails($ideaId);
	$groups = getGroupsForCreatorUser($_SESSION['innoworks.ID']);
	$othergroups = getPartOfGroupsForUser($_SESSION['innoworks.ID']);

	if ($item && dbNumRows($item) > 0) {
		renderGenericInfoForm(array(), dbFetchObject($item), array("riskEvaluationId","groupId","userId","ideaId"));
		echo "<a href='logAction()' onclick=''>Remove from this group</a>";
		echo "Go to <a href='javascript:showGroups(); dijit.byId(\"ideasPopup\").hide()'>Groups</a> to edit data";
	} else {?>
<p>No share data for this idea</p>
<p>Share idea with a group:</p>
<ul>
<?
if ($groups && dbNumRows($groups) > 0 ) {
	while ($group = dbFetchObject($groups)) {
		renderIdeaGroupItem($ideaId, $group);
	}
}
if ($othergroups && dbNumRows($othergroups) > 0 ) {
	while ($group = dbFetchObject($othergroups)) {
		renderIdeaGroupItem($ideaId, $group);
	}
}
?>
</ul>
Show
<a href='javascript:showGroups(); dijit.byId(\"ideasPopup\").hide()'>Groups</a>
<?}
}

function renderIdeaGroupItem($ideaId, $group) { ?>
<li><a href="javascript:logAction()"
	onclick="addIdeaToGroup('<?= $ideaId ?>','<?= $group->groupId ?>');loadPopupShow()"><?= $group->title ?></a></li>
<?}?>