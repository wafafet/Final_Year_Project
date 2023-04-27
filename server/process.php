<?php


    require 'config.php';
    //selects the latest entry in the database
    $sql = "SELECT * FROM `data` ORDER BY dt DESC LIMIT 1 ";
    $result = $db->query($sql);
    if (!$result) {
    { echo "Error: " . $sql . "<br>" . $db->error; }
    }
    $rows = $result -> fetch_assoc();
    echo json_encode($rows);
    
    
   
?>