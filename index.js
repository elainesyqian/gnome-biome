function updateTimeDate() {
  const currentTimeElement = document.getElementById("current-time");
  const currentDateElement = document.getElementById("current-date");

  const now = new Date();
  const optionsTime = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const optionsDate = { year: "numeric", month: "long", day: "numeric" };

  currentTimeElement.textContent = now.toLocaleTimeString([], optionsTime);
  currentDateElement.textContent = now.toLocaleDateString([], optionsDate);
}

setInterval(updateTimeDate, 1000); // Update every second

function checkMoodSubmission() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // Month is zero-based
  const currentDate = now.getDate();
  const dateString = `${currentYear}-${String(currentMonth).padStart(
    2,
    "0"
  )}-${String(currentDate).padStart(2, "0")}`;
  const lastSubmittedDate = localStorage.getItem("lastMoodSubmitDate");

  if (lastSubmittedDate === dateString) {
    document.getElementById("mood-form").classList.remove("hidden");
    document.getElementById(
      "mood-message"
    ).textContent = `Mood for today: ${localStorage.getItem("todayMood")}`;
  }

  const form = document.getElementById("mood-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const mood = formData.get("mood");

    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    const existingMood = moods.find((m) => m.date === dateString);

    if (existingMood) {
      existingMood.mood = mood;
    } else {
      moods.push({ date: dateString, mood: mood });
    }

    localStorage.setItem("moods", JSON.stringify(moods));
    localStorage.setItem("lastMoodSubmitDate", dateString);
    localStorage.setItem("todayMood", mood);

    document.getElementById(
      "mood-message"
    ).textContent = `Mood for today: ${mood}`;
    document.getElementById("mood-form").classList.add("hidden");
    generateCalendar(); // Update calendar immediately after mood submission
  });
}

// Mood Tracker Functionality
const moodForm = document.getElementById("mood-form");
const moodMessage = document.getElementById("mood-message");

moodForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const selectedMood = document.querySelector('input[name="mood"]:checked');
  if (!selectedMood) {
    moodMessage.textContent = "Please select a mood.";
    return;
  }

  const now = new Date();
  const currentTime = now.getTime();
  localStorage.setItem("lastMoodSubmitTime", currentTime);
  localStorage.setItem("todayMood", selectedMood.value);

  moodMessage.textContent = "Thank you for submitting your mood!";
  document.getElementById("mood-tracking-form").classList.add("hidden");
  generateCalendar(); // Update calendar immediately after mood submission
});

const moodLabels = document.querySelectorAll("#mood-form label");

// Add event listener to each label
moodLabels.forEach((label, index) => {
  label.addEventListener("click", function () {
    moodLabels.forEach((label) => label.classList.remove("checked"));
    label.classList.add("checked");
  });

  if (index === moodLabels.length - 1) {
    label.addEventListener("click", function () {
      moodLabels.forEach((label) => label.classList.remove("checked"));
      label.classList.add("checked");
    });
  }
});

let currentYear, currentMonth;

function updateCalendarNav() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.getElementById(
    "calendar-month-year"
  ).textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

function generateCalendar() {
  const calendarElement = document.getElementById("calendar");
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  const moods = JSON.parse(localStorage.getItem("moods")) || [];

  calendarElement.innerHTML = `
    <div class="calendar-day-name">Sun</div>
    <div class="calendar-day-name">Mon</div>
    <div class="calendar-day-name">Tue</div>
    <div class="calendar-day-name">Wed</div>
    <div class="calendar-day-name">Thu</div>
    <div class="calendar-day-name">Fri</div>
    <div class="calendar-day-name">Sat</div>
  `;

  for (let i = 0; i < firstDay; i++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    calendarElement.appendChild(dayElement);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const moodData = moods.find((m) => m.date === dateString);

    if (moodData) {
      const moodLabel = document.querySelector(
        `.mood-label input[value="${moodData.mood}"]`
      ).parentElement;
      const moodColor = moodLabel.getAttribute("data-color");
      dayElement.style.backgroundColor = moodColor;
      dayElement.style.color = "white";
    }

    calendarElement.appendChild(dayElement);
  }
}

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendarNav();
  generateCalendar();
}

window.onload = function () {
  updateTimeDate();
  checkMoodSubmission();

  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();

  updateCalendarNav();
  generateCalendar();

  document.getElementById("prev-month").addEventListener("click", function () {
    changeMonth(-1);
  });

  document.getElementById("next-month").addEventListener("click", function () {
    changeMonth(1);
  });
};
