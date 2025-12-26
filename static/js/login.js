function getRadioValue(event) {
  const radios = document.getElementsByName("role");
  let selectedValue = "";

  for (const radio of radios) {
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }

  if (!selectedValue) {
    alert("Please select an option.");
    event.preventDefault(); // Prevent form submission if no option is selected
    return false;
  }

  // Do NOT redirect here; let the form submit to /login
  // Flask will validate username/password/role and redirect
  // to /supervisor-dashboard, /therapist-dashboard, or /patient-dashboard.

  return true; // allow normal form submission
}

//--------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const availableSlots = document.querySelectorAll(".available");
  let selectedSlot = null;

  availableSlots.forEach((slot) => {
    slot.addEventListener("click", function () {
      // Deselect previously selected slot
      if (selectedSlot) {
        selectedSlot.classList.remove("selected");
        selectedSlot.textContent = "available";
        selectedSlot.style.backgroundColor = "green";
      }

      // Select current slot
      this.classList.add("selected");
      this.textContent = "Selected";
      this.style.backgroundColor = "orange";
      selectedSlot = this;
    });
  });
});
