<?php
   require'config.php';
   $sql = "SELECT lng, lat FROM `data` WHERE dt > NOW() - INTERVAL 48 HOUR";
   $result = $db->query($sql);
   if (!$result) {
    { echo "Error: " . $sql . "<br>" . $db->error; }
    }
    $rows = $result ->  fetch_all(MYSQLI_NUM);
    echo json_encode($rows);
?>