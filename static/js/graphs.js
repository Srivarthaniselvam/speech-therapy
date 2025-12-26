const reports = [
  {
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    sessionDate: "2024-09-10",
    reportContent: "Therapy session went well. Improvement in speech.",
    status: "Sent for Approval",
  },
  {
    patientName: "Jane Doe",
    doctorName: "Dr. Alice",
    sessionDate: "2024-09-11",
    reportContent: "Patient struggling with articulation.",
    status: "Sent for Approval",
  },
];

function loadReports() {
  const reportList = document.getElementById("reportList");
  reports.forEach((report, index) => {
    const reportCard = document.createElement("div");
    reportCard.classList.add("report-card");

    reportCard.innerHTML = `
                    <h3>Report for: ${report.patientName}</h3>
                    <p><strong>Doctor:</strong> ${report.doctorName}</p>
                    <p><strong>Session Date:</strong> ${report.sessionDate}</p>
                    <p><strong>Report:</strong> ${report.reportContent}</p>
                    <label for="input-${index}"><strong>Additional Input:</strong></label>
                    <textarea id="input-${index}" placeholder="Add comments..."></textarea>
                    <div>
                        <button class="btn approve-btn" onclick="approveReport(${index})">Approve</button>
                        <button class="btn disapprove-btn" onclick="disapproveReport(${index})">Disapprove</button>
                    </div>
                    <hr />
                `;

    reportList.appendChild(reportCard);
  });
}

window.onload = loadReports;

function toggleAnswer(index) {
  const answers = document.querySelectorAll(".answer");
  answers[index].classList.toggle("active");
}

// Charts for the Patient Reports Page
const ctx1 = document.getElementById("speechProgress").getContext("2d");
const speechProgressChart = new Chart(ctx1, {
  type: "line",
  data: {
    labels: ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"],
    datasets: [
      {
        label: "Speech Clarity",
        data: [30, 50, 45, 57, 78],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: { beginAtZero: true },
    },
  },
});

// Performance in Therapy Areas Bar Chart
const ctx2 = document.getElementById("therapyAreas").getContext("2d");
const therapyAreasChart = new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["Vocabulary", "Fluency", "Articulation", "Comprehension"],
    datasets: [
      {
        label: "Patient Scores",
        data: [70, 85, 60, 90],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: { beginAtZero: true },
    },
  },
});

// Holistic View of Patient Skills Radar Chart
const ctx3 = document.getElementById("therapyRadar").getContext("2d");
const therapyRadarChart = new Chart(ctx3, {
  type: "radar",
  data: {
    labels: [
      "Articulation",
      "Fluency",
      "Comprehension",
      "Pronunciation",
      "Listening",
    ],
    datasets: [
      {
        label: "Patient Skill Levels",
        data: [80, 75, 90, 70, 85],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  },
  options: {
    scales: {
      r: { beginAtZero: true },
    },
  },
});

// Focus Areas in Therapy Pie Chart
const ctx4 = document.getElementById("focusDistribution").getContext("2d");
const focusDistributionChart = new Chart(ctx4, {
  type: "pie",
  data: {
    labels: ["Articulation", "Comprehension", "Fluency", "Vocabulary"],
    datasets: [
      {
        data: [25, 25, 30, 20],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
});
