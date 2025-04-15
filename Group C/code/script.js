document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  // Register form handler
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = registerForm.querySelector('input[placeholder="Full Name"]').value;
      const email = registerForm.querySelector('input[placeholder="Email"]').value;
      const userType = registerForm.querySelector('#userType').value;
      const password = registerForm.querySelector('input[placeholder="Password"]').value;

      const response = await fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          fullName,
          email,
          password,
          userType
        })
      });

      const result = await response.text();
      alert(result === "success" ? "Registered successfully!" : "Registration failed.");
    });
  }

  // Login form handler
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
});


async function handleLogin(event) {
  console.log("Form is being submitted");

  event.preventDefault();

  const email = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;

  console.log("Email:", email);
  console.log("Password:", password);

  if (email === "" || password === "") {
    alert("Please fill in all fields!");
    return;
  }

  const response = await fetch("login.php", {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password: password })
  });

  const result = await response.text();
  console.log("Raw response:", result);

  try {
    const parsedResult = JSON.parse(result);
    console.log("Parsed result:", parsedResult);

    sessionStorage.setItem("user_name", parsedResult.name);
    sessionStorage.setItem("user_type", parsedResult.user_type);
    sessionStorage.setItem("user_id", parsedResult.id);


    if (parsedResult.status === "success") {
      alert(`Welcome ${parsedResult.name}! Redirecting to your dashboard...`);
      if (parsedResult.user_type === "job_seeker") {
        window.location.href = "JobSeeker.html";
      } else if (parsedResult.user_type === "job_provider") {
        window.location.href = "JobProvider.html";
      }
    } else {
      alert("Login failed: " + parsedResult.message);
    }
  } catch (err) {
    console.error("Error parsing response JSON:", err);
    alert("Unexpected server response.");
  }
}



document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent link from reloading page
      sessionStorage.clear();
      window.location.href = "login.html";
    });
  }
});

async function loadJobs() {
  const jobContainer = document.getElementById("jobContainer");
  const response = await fetch("fetch_jobs.php");
  const jobs = await response.json();

  jobContainer.innerHTML = ""; // Clear previous content

  jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
          <h2>${job.title}</h2>
          <p><strong>${job.domain}</strong></p>
          <p><strong>Posted By:</strong> ${job.posted_by_name}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Date:</strong> ${new Date(job.posted_on).toDateString()}</p>
          <button onclick="applyToJob(${job.id})">Apply</button> <!-- Pass job.id here -->
      `;
      jobContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Load jobs if container exists
  if (document.getElementById("jobContainer")) {
    loadJobs();
  }

  // Add search filter
  const searchInput = document.getElementById("jobSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const jobCards = document.querySelectorAll(".job-card");

      jobCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(searchTerm) ? "block" : "none";
      });
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  console.log("Form Submit JS running!");

  const form = document.getElementById("job-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch("post_job.php", {
          method: "POST",
          body: formData
        });

        const result = await response.text();
        console.log("Server response:", result);

        if (result.trim() === "success") {
          alert("Job posted successfully!");
          form.reset();
        } else {
          alert("Failed to post job: " + result);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    });
  }
});


  document.addEventListener("DOMContentLoaded", async () => {
    const jobContainer = document.getElementById("jobContainer");
    const posted_by = sessionStorage.getItem("user_id");

    if (!posted_by) {
      jobContainer.innerHTML = "<p>Please log in to view your posted jobs.</p>";
      return;
    }

    const response = await fetch(`fetch_my_jobs.php?posted_by=${posted_by}`);
    const jobs = await response.json();

    if (jobs.length === 0) {
      jobContainer.innerHTML = "<p>No jobs posted yet.</p>";
      return;
    }

    jobContainer.innerHTML = ""; // clear

    jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <h2>${job.title}</h2>
        <p><strong>${job.domain}</strong></p>
        <p>${new Date(job.posted_on).toDateString()}</p>
        <p>${job.location}</p>
      `;
      jobContainer.appendChild(card);
    });
  });

  async function loadAppliedJobs() {
    const seekerId = sessionStorage.getItem("user_id");
    const response = await fetch(`fetch_applied_jobs.php?seeker_id=${seekerId}`);
    const jobs = await response.json();

    const container = document.getElementById("appliedJobsContainer");
    container.innerHTML = ""; // Clear previous content

    if (jobs.length === 0) {
        container.innerHTML = "<p>You haven’t applied to any jobs yet.</p>";
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement("div");
        card.className = "job-card";
        card.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>${job.domain}</strong> - ${job.location}</p>
            <p>Applied On: ${new Date(job.applied_on).toDateString()}</p>
        `;
        container.appendChild(card);
    });
}

async function loadApplicants(jobId) {
  const response = await fetch(`fetch_job_applicants.php?job_id=${jobId}`);
  const applicants = await response.json();

  const container = document.getElementById("applicantsContainer");
  container.innerHTML = ""; // Clear previous content

  if (applicants.length === 0) {
      container.innerHTML = "<p>No one has applied to this job yet.</p>";
      return;
  }

  applicants.forEach(applicant => {
      const div = document.createElement("div");
      div.className = "applicant-card";
      div.innerHTML = `
          <p><strong>Name:</strong> ${applicant.full_name}</p>
          <p><strong>Email:</strong> ${applicant.email}</p>
          <p><strong>Applied On:</strong> ${new Date(applicant.applied_on).toDateString()}</p>
      `;
      container.appendChild(div);
  });
}

async function applyToJob(jobId) {
  const seekerId = sessionStorage.getItem("user_id");

  if (!seekerId) {
      alert("Please log in to apply for jobs.");
      return;
  }

  const response = await fetch("apply_job.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ job_id: jobId, seeker_id: seekerId })
  });

  const result = await response.text();

  if (result === "success") {
      alert("Application submitted!");
  } else if (result === "already_applied") {
      alert("You have already applied to this job.");
  } else {
      alert("Application failed.");
  }
}


const canvas = document.getElementById("network-canvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let points = [];
  const pointCount = 80;
  const maxDist = 100;

  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5),
      vy: (Math.random() - 0.5)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      for (let j = idx + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / maxDist})`;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}



