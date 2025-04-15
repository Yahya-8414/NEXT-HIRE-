<?php
header('Content-Type: text/plain');
include 'db.php';

// Debug: Save POST data to a file
file_put_contents("debug_post_log.txt", print_r($_POST, true));

$title = $_POST['title'] ?? '';
$domain = $_POST['domain'] ?? '';
$location = $_POST['location'] ?? '';
$description = $_POST['description'] ?? '';
$posted_by = $_POST['posted_by'] ?? 0;

// Validate inputs
if (empty($title) || empty($domain) || empty($location) || empty($description) || !$posted_by) {
    echo "missing_fields";
    exit;
}

// Prepare query
$sql = "INSERT INTO jobs (title, domain, location, description, posted_by) 
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "db_prepare_error: " . $conn->error;
    exit;
}

$stmt->bind_param("ssssi", $title, $domain, $location, $description, $posted_by);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "sql_error: " . $stmt->error;
}
?>
