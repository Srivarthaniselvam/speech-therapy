const doctorCardsContainer = document.getElementById("doctorCards");
const findDoctorsBtn = document.getElementById("findDoctorsBtn");

// Sample data of doctors (in real-world application, this data would be fetched from a server)
const doctorsData = [
  {
    name: "Dr. Aditi Sharma",
    age: 45,
    experience: 20,
    hospital: "City Hospital",
    degree: "MBBS, MD",
    pincode: "123456",
  },
  {
    name: "Dr. Kunal Verma",
    age: 38,
    experience: 12,
    hospital: "Apollo Clinic",
    degree: "MBBS, DNB",
    pincode: "123456",
  },
  {
    name: "Dr. Maya Singh",
    age: 50,
    experience: 25,
    hospital: "Global Health Hospital",
    degree: "MBBS, MD, PhD",
    pincode: "654321",
  },
  {
    name: "Dr. Rahul Deshmukh",
    age: 40,
    experience: 15,
    hospital: "Sunshine Hospital",
    degree: "MBBS, MS",
    pincode: "123456",
  },
];

// Function to render doctor cards
function renderDoctors(pincode) {
  if (!doctorCardsContainer) return;

  doctorCardsContainer.innerHTML = ""; // Clear previous results

  // Filter doctors based on pincode
  const filteredDoctors = doctorsData.filter(
    (doctor) => doctor.pincode === pincode
  );

  if (filteredDoctors.length > 0) {
    filteredDoctors.forEach((doctor) => {
      const doctorCard = `
        <div class="doctor-card">
          <h3>${doctor.name}</h3>
          <p><strong>Age:</strong> ${doctor.age}</p>
          <p><strong>Experience:</strong> ${doctor.experience} years</p>
          <p><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p><strong>Degree:</strong> ${doctor.degree}</p>
          <button onclick="bookAppointment('${doctor.name}')">Book Appointment</button>
        </div>
      `;
      doctorCardsContainer.innerHTML += doctorCard;
    });
  } else {
    doctorCardsContainer.innerHTML =
      `<p>No doctors found in this area. Try a different pincode.</p>`;
  }
}

// Event listener for the button
if (findDoctorsBtn) {
  findDoctorsBtn.addEventListener("click", function () {
    const pincode = document.getElementById("pincode")?.value.trim();
    if (pincode) {
      renderDoctors(pincode);
    } else {
      alert("Please enter a valid pincode.");
    }
  });
}

// Function to simulate booking an appointment
function bookAppointment(doctorName) {
  alert(`Appointment request sent to ${doctorName}.`);
}
