<?php
// apply_job.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $job_id = $_POST['job_id'];
    $seeker_id = $_POST['seeker_id'];

    // Check if the user has already applied for the job
    // Example query to check if already applied
    $checkQuery = "SELECT * FROM job_applications WHERE job_id = ? AND seeker_id = ?";
    // Prepare and execute the query...

    if ($alreadyApplied) {
        echo "already_applied";
        exit;
    }

    // Insert application into the database
    $insertQuery = "INSERT INTO job_applications (job_id, seeker_id) VALUES (?, ?)";
    // Prepare and execute the insert query...

    echo "success"; // Return success response
}
?>