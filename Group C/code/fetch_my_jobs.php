<?php
header('Content-Type: application/json');
include 'db.php';

$posted_by = $_GET['posted_by'] ?? 0;

$sql = "SELECT title, domain, location, posted_on FROM jobs WHERE posted_by = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $posted_by);
$stmt->execute();
$result = $stmt->get_result();

$jobs = [];
while ($row = $result->fetch_assoc()) {
    $jobs[] = $row;
}

echo json_encode($jobs);
?>
