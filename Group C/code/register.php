<?php
include 'db.php';

$fullName = $_POST['fullName'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$userType = $_POST['userType'];

$sql = "INSERT INTO users (full_name, email, password, user_type) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $fullName, $email, $password, $userType);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}

?>
