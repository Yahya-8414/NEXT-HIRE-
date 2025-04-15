<?php
header('Content-Type: application/json');
include 'db.php';

$sql = "SELECT jobs.*, users.full_name AS posted_by_name 
        FROM jobs 
        JOIN users ON users.id = jobs.posted_by 
        ORDER BY posted_on DESC";

$result = $conn->query($sql);
$jobs = [];

while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode($jobs);
?>
