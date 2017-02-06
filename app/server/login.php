<?php
require_once 'DB/db.class.php';

$db = new DB();
$user =  json_decode( file_get_contents("php://input"), true );

$db->authUser($user['email'], $user['password']);
