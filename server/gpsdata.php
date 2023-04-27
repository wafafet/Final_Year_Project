<?php

    include 'process.php';
    $key = $_GET['key'];
    $lat = $_GET['lat'];
    $lng = $_GET['lng'];
    $spd = $_GET['spd'];
    
    $hash_key = hash('md5',$key);
    // echo $lat;
    // echo "<br>";
    // echo $lng;
    
    if(abs($rows['lat']-$lat)< 1 && abs($rows['lng']-$lng)<1){

        if(hash_equals($hash_key,hash('md5','nitap2019'))){
            $sql = "INSERT INTO data(lat,lng,speed) VALUES('".$lat."','".$lng."','".$spd."')";
            
            if($db->query($sql) === FALSE)
                { echo "Error: " . $sql . "<br>" . $db->error; }
            
            // echo "<br>";
            // echo $db->insert_id;
        }
    }

 ?>