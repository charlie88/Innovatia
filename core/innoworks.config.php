<?
//DB CREDENTIALS
$dbUser = 'root'; 
$dbPass = 'return';
$dbURL = 'localhost';
$dbSchema = 'innovation_works';

//LDAP 
$ldapUser = 'cn=admin,dc=example,dc=com';
$ldapPass = 'secret';
$ldapHost = 'ldap://localhost';
$ldapPort = '389';
$ldapFullUrl = 'ldap://localhost';
$usesLdap = false;

//PATHS
$serverUrl = 'http://localhost';
$serverRoot = '/innovation/'; 
$usersRoot = $serverRoot.'users/'; 
$uiRoot = $serverRoot.'ui/'; 
$serverAdminEmail = 'james.hornitzky@uts.edu.au';

//OTHER PROPERTIES
$loglevel = 0; //0-5, with 0 being lowest
$salt = '123456789987654321';
?>