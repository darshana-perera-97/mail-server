import React, { useState } from "react";

const ScheduleBackup = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [error, setError] = useState("");

  // Handle day selection
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Handle hours input change
  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 24) {
      setHours(value);
    }
  };

  // Handle minutes input change
  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 60) {
      setMinutes(value);
    }
  };

  // Submit the data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!selectedDay || hours === "" || minutes === "") {
      setError("Please select a day and enter a valid time.");
      return;
    }

    if (hours < 0 || hours > 24 || minutes < 0 || minutes > 60) {
      setError(
        "Please enter a valid time. Hours must be between 0 and 24, minutes between 0 and 60."
      );
      return;
    }

    // Prepare data
    const data = { day: selectedDay, time: `${hours}:${minutes}` };

    try {
      const response = await fetch("http://localhost:5002/scheduleBackup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setError(""); // Clear previous errors
        alert("Backup scheduled successfully!");
      } else {
        setError("Failed to schedule backup.");
      }
    } catch (error) {
      setError("Error sending data.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Schedule Backup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select a day:
            <div>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <label key={day}>
                  <input
                    type="radio"
                    name="day"
                    value={day}
                    checked={selectedDay === day}
                    onChange={handleDayChange}
                  />
                  {day}
                </label>
              ))}
            </div>
          </label>
        </div>

        <div>
          <label>
            Enter time:
            <div>
              <input
                type="number"
                value={hours}
                onChange={handleHoursChange}
                placeholder="HH"
                min="0"
                max="24"
              />
              :
              <input
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                placeholder="MM"
                min="0"
                max="60"
              />
            </div>
          </label>
        </div>

        <button type="submit">Schedule Backup</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ScheduleBackup;
