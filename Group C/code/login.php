<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
include 'db.php';

// MATCH THESE with JS keys exactly:
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing credentials']);
    exit;
}


$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        echo json_encode([
            'status' => 'success',
            'id' => $user['id'],
            'name' => $user['full_name'],
            'user_type' => $user['user_type']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password']);
    }
} else {
    echo json_encode(['status' => 'fail', 'message' => 'User not found.']);
}
?>
