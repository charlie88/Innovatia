<table>
	<tr>
		<td><img
			src="<?= $serverUrl . $uiRoot ?>innoworks/retrieveImage.php?action=userImg&actionId=<?= $userDetails->userId?>"
			style="width: 3em; height: 3em;" />
		</td>
		<td>
			<h3>
			<?= $userDetails->firstName?>
			<?= $userDetails->lastName?>
				/
				<?= $userDetails->username?>
			</h3> <?= $userDetails->organization?> | <? if ($userDetails->isAdmin) { ?><i>admin</i>
			| <?}?> <span class="summaryActions"><a href="javascript:logAction()"
				onclick="printUser('&profile=<?= $userDetails->userId?>');">Print</a>
		</span></td>
	</tr>
</table>
				<? if ($userDetails->isPublic == 1 || $_SESSION['innoworks.isAdmin']) {
					renderGenericInfoForm(null ,$userDetails, array("ideaId", "title","userId", "createdTime", "username", "password", 'firstName', 'lastName', 'isAdmin', 'isExternal', 'sendEmail', 'lastUpdateTime', 'organization', 'isPublic'));
				}?>

<p>
	<b>Idea(s)</b>
	<?if ($ideas && dbNumRows($ideas) > 0 ) {
		while ($idea = dbFetchObject($ideas)) {
			if (hasAccessToIdea($idea->ideaId, $_SESSION['innoworks.ID'])) {?>
<div class="itemHolder">
	<img
		src="<?= $serverUrl . $uiRoot ?>innoworks/retrieveImage.php?action=ideaImg&actionId=<?= $idea->ideaId?>"
		style="width: 1em; height: 1em;" /> <a href="javascript:logAction()"
		onclick="showIdeaSummary('<?= $idea->ideaId?>');"><?=$idea->title?>
	</a>
</div>
			<?}
			if (dbNumRows($ideas) == 500) {?>
<p>Only displaying 500 latest ideas</p>
			<?}
		}
	} else {?>
<p>None</p>
	<?}?>

<p>
	<b>Group(s)</b>
</p>
	<?if ($groups && dbNumRows($groups) > 0 ) {
		while ($group = dbFetchObject($groups)) {?>
<div class="itemHolder">
	<img
		src="<?= $serverUrl . $uiRoot ?>innoworks/retrieveImage.php?action=groupImg&actionId=<?= $group->groupId?>"
		style="width: 1em; height: 1em;" /> <a href="javascript:logAction()"
		onclick="showGroupSummary(<?= $group->groupId?>);"><?=$group->title?>
	</a>
</div>
		<?}
		if (dbNumRows($groups) == 100) {?>
<p>Only displaying 100 latest groups</p>
		<?}
	} else {?>
<p>None</p>
<?}?>