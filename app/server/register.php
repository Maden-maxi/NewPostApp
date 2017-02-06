<?php
require_once "DB/db.class.php";
$user = json_decode( file_get_contents("php://input"), true );
$db = new DB();

$db->createUser($user);
