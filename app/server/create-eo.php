<?php
require_once "DB/db.class.php";

$data = json_decode( file_get_contents("php://input"), true );

//var_dump($data);
$db = new DB();
//$db->createExpressOverhead($data['eo'], $data['recipient'], $data['locations']);
$db->create_eo($data['eo']);