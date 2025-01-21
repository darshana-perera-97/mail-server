import React, { useEffect, useState } from "react";

const ViewScheduleComponent = () => {
  const [schedule, setSchedule] = useState({ Day: "", Time: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch schedule from the API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch("http://localhost:5002/getTime");

        if (!response.ok) {
          throw new Error("Failed to fetch schedule.");
        }

        const data = await response.json();
        setSchedule(data); // Set Day and Time
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred.");
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Current Schedule</h2>
      <p>
        <strong>Day:</strong> {schedule.Day}
      </p>
      <p>
        <strong>Time:</strong> {schedule.Time}
      </p>
    </div>
  );
};

export default ViewScheduleComponent;
