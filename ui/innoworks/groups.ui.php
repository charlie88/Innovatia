<? 
require_once("thinConnector.php"); 
import("group.service");
 
function renderDefault() {
	echo "<h3>My Groups</h3>";
	$groups = getGroupsForCreatorUser($_SESSION['innoworks.ID']);
	if ($groups && dbNumRows($groups) > 0 ) {
		while ($group = dbFetchObject($groups)) {
			renderGroup($groups,$group);
		}
	} else {
		echo "<p>No groups</p>";
	}
	
	echo "<h3>Groups I'm part of</h3>";
	$groups = getPartOfGroupsForUser($_SESSION['innoworks.ID']);
	if ($groups && dbNumRows($groups) > 0 ) {
		while ($group = dbFetchObject($groups)) {
			renderPartOfGroups($groups,$group);
		}
	} else {
		echo "<p>No groups that Im just part of</p>";
	}
	
	echo "<h3>Other Groups</h3>";
	$groups = getOtherGroupsForUser($_SESSION['innoworks.ID']);
	if ($groups && dbNumRows($groups) > 0 ) {
		while ($group = dbFetchObject($groups)) {
			renderOtherGroup($groups,$group);
		}
	} else {
		echo "<p>No other groups</p>";
	}
} 

function renderGroup($groups, $group) {
	echo "<a href='javascript:updateForGroup(\"".$group->groupId."\")'>". $group->title . "</a>";
	echo "<input type='button' onclick='deleteGroup(" . $group->groupId .")' value=' - ' />";
}

function renderPartOfGroups($groups, $group) {
	echo "<a href='javascript:updateForGroup(\"".$group->groupId."\")'>". $group->title . "</a>";
}

function renderOtherGroup($groups, $group) {
	echo $group->title;
}

function renderDetails($currentGroupId) {
	$groups = getGroupWithId($currentGroupId, $_SESSION['innoworks.ID']); 
	
	if ($groups && (dbNumRows($groups) == 1)) {
		$group = dbFetchObject($groups); 
		//echo "IDS: " . $group->userId . " | Session: " . $_SESSION['innoworks.ID'];
		
		echo "<h3>Users</h3>";
		if ($group->userId == $_SESSION['innoworks.ID']) echo "<input type='button' value=' + ' onclick='showAddGroupUser()'/>";
		
		$groupUsers = getUsersForGroup($currentGroupId);
		if ($groupUsers && dbNumRows($groupUsers) > 0) {
			echo "<ul>";
			while ($user = dbFetchObject($groupUsers)) {
				echo "<li>" . $user->username;
				if ($group->userId == $_SESSION['innoworks.ID']) echo "<input type='button' value =' - ' onclick='delUserFromCurGroup($user->userId)'/>";
				echo "</li>";
			}
			echo "</ul>";
		} else {
			echo "<p>None</p>";
		}
		
		echo "<h3>Ideas</h3>";
		echo "<input type='button' value=' + ' onclick='showAddGroupIdea()'/>";
		$groupIdeas = getIdeasForGroup($currentGroupId);
		if ($groupIdeas && dbNumRows($groupIdeas) > 0) {
			echo "<ul>";
			while ($idea = dbFetchObject($groupIdeas)) {
				echo "<li>" . $idea->title;
				if ($idea->userId == $_SESSION['innoworks.ID']) echo "<input type='button' value =' - ' onclick='delIdeaFromCurGroup($idea->ideaId)'/>";
				echo "</li>";
			}
			echo "</ul>";
		} else {
			echo "<p>None</p>";
		}
	} else {
		echo "Error. Group Not Found.";
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
?>
