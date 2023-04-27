<?php
    define('DB_HOST', 'localhost:3307'); 
    define('DB_USERNAME', 'root'); 
    define('DB_PASSWORD', ''); 
    define('DB_NAME', 'data');

    $db = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME); 
 
// Display error if failed to connect 
    if ($db->connect_error) { 
        echo "Connection to database  failed: ".$db->connect_error;
        exit();
    }
?>