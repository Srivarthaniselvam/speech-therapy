// ================== PROFILE POPUP (ALL DASHBOARDS) ==================

function toggleProfileCard() {
  const card = document.getElementById("profile-card");
  if (!card) return;
  card.classList.toggle("hidden");
}

// Close profile card when clicking outside its content
window.addEventListener("click", function (event) {
  const card = document.getElementById("profile-card");
  if (!card || card.classList.contains("hidden")) return;
  const inner = card.querySelector(".profile-card");
  if (inner && !inner.contains(event.target) && event.target.id !== "profile-card") {
    card.classList.add("hidden");
  }
});

// ================== APPOINTMENT DIALOG (PATIENT) ==================

// Get elements (may not exist on every page)
const openDialogBtn = document.getElementById("openDialogBtn");
const dialogBox = document.getElementById("dialogBox");
const closeDialogBtn = document.getElementById("closeDialogBtn");

if (openDialogBtn && dialogBox && closeDialogBtn) {
  // Open dialog when button is clicked
  openDialogBtn.onclick = function () {
    dialogBox.style.display = "block";
  };

  // Close dialog when close button is clicked
  closeDialogBtn.onclick = function () {
    dialogBox.style.display = "none";
  };

  // Close dialog when clicking outside of the dialog
  window.addEventListener("click", function (event) {
    if (event.target === dialogBox) {
      dialogBox.style.display = "none";
    }
  });
}

// ================== SLOT SELECTION (PATIENT APPOINTMENTS) ==================

// Get all available slots
const availableSlots = document.querySelectorAll(".available");

// Variable to store the currently selected slot
let selectedSlot = null;

availableSlots.forEach((slot) => {
  slot.addEventListener("click", function () {
    // If there is already a selected slot, remove its 'selected' class
    if (selectedSlot) {
      selectedSlot.classList.remove("selected");
    }

    // Set the clicked slot as the selected slot and apply 'selected' class
    this.classList.add("selected");
    selectedSlot = this;
  });
});

// ================== REPORT PAGE (THERAPIST → PATIENT REPORT) ==================

// Function to store report history
const reportHistory = [];

// Function to send report for approval
function sendForApproval() {
  const patientName = document.getElementById("patientName")?.value;
  const doctorName = document.getElementById("doctorName")?.value;
  const sessionDate = document.getElementById("sessionDate")?.value;
  const reportContent = document.getElementById("reportContent")?.value;

  const successEl = document.getElementById("successMessage");

  if (!successEl) return;

  if (patientName && doctorName && sessionDate && reportContent) {
    successEl.innerHTML = "Report has been sent for approval!";
    successEl.style.color = "green";
    successEl.style.display = "block";

    // Update history with status "Sent for Approval"
    addReportToHistory(
      patientName,
      doctorName,
      sessionDate,
      "Sent for Approval"
    );
  } else {
    successEl.innerHTML = "Please fill out all fields.";
    successEl.style.color = "red";
    successEl.style.display = "block";
  }
}

// Function to add report to the history table
function addReportToHistory(patientName, doctorName, sessionDate, status) {
  reportHistory.push({ patientName, doctorName, sessionDate, status });

  const table = document.getElementById("reportHistory");
  if (!table) return;

  const tableBody = table.getElementsByTagName("tbody")[0];
  const newRow = tableBody.insertRow();

  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);

  cell1.innerHTML = patientName;
  cell2.innerHTML = doctorName;
  cell3.innerHTML = sessionDate;
  cell4.innerHTML = status;
}

// Function to download report as PDF
function downloadPDF() {
  const patientName = document.getElementById("patientName")?.value;
  const doctorName = document.getElementById("doctorName")?.value;
  const sessionDate = document.getElementById("sessionDate")?.value;
  const reportContent = document.getElementById("reportContent")?.value;

  if (patientName && doctorName && sessionDate && reportContent) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("PDF library not loaded.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Patient Name: ${patientName}`, 10, 10);
    doc.text(`Doctor's Name: ${doctorName}`, 10, 20);
    doc.text(`Session Date: ${sessionDate}`, 10, 30);
    doc.text(`Session Report:`, 10, 40);
    doc.text(reportContent, 10, 50);

    doc.save(`${patientName}_Session_Report.pdf`);
  } else {
    alert("Please fill out all fields before downloading.");
  }
}

// ================== PROFILE PAGE (LEGACY – SAFE, OPTIONAL) ==================

function modifyFields() {
  const roleEl = document.getElementById("role");
  if (!roleEl) return;

  const role = roleEl.value;

  const patientFields = document.getElementById("patient-fields");
  const therapistFields = document.getElementById("therapist-fields");
  const supervisorFields = document.getElementById("supervisor-fields");

  if (!patientFields || !therapistFields || !supervisorFields) return;

  patientFields.classList.add("hidden");
  therapistFields.classList.add("hidden");
  supervisorFields.classList.add("hidden");

  if (role === "patient") {
    patientFields.classList.remove("hidden");
  } else if (role === "therapist") {
    therapistFields.classList.remove("hidden");
  } else if (role === "supervisor") {
    supervisorFields.classList.remove("hidden");
  }
}

function submitForm() {
  const roleEl = document.getElementById("role");
  const nameEl = document.getElementById("name");
  const ageEl = document.getElementById("age");
  const mobileEl = document.getElementById("mobile");
  const addressEl = document.getElementById("address");

  if (!roleEl || !nameEl || !ageEl || !mobileEl || !addressEl) return;

  const role = roleEl.value;
  const name = nameEl.value;
  const age = ageEl.value;
  const mobile = mobileEl.value;
  const address = addressEl.value;

  if (!role || !name || !age || !mobile || !address) {
    alert("Please fill all required fields.");
    return;
  }
}

// ================== APPOINTMENTS-THERAPIST PAGE ==================

function releaseSlot(button) {
  const row = button.parentElement.parentElement;
  const date = row.cells[0].textContent;
  const time = row.cells[1].textContent;

  if (
    confirm(`Are you sure you want to release the slot on ${date} at ${time}?`)
  ) {
    row.remove();
  }
}

function releaseNewSlot() {
  const date = document.getElementById("appointmentDate")?.value;
  const time = document.getElementById("appointmentTime")?.value;

  if (!date || !time) {
    alert("Please select both date and time.");
    return;
  }

  if (confirm(`Do you want to release a slot on ${date} at ${time}?`)) {
    const tbody = document.querySelector("table tbody");
    if (!tbody) return;

    const newRow = tbody.insertRow();
    newRow.innerHTML = `
      <td>${date}</td>
      <td>${time}</td>
      <td>-</td>
      <td><button class="btn-release" onclick="releaseSlot(this)">Cancel Appointment</button></td>
    `;
  }
}
