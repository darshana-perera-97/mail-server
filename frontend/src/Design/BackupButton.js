import React from "react";

const BackupButton = () => {
  const handleBackup = async () => {
    try {
      const response = await fetch("http://localhost:5002/backupNow", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Display success message
      } else {
        alert(data.message); // Display error message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Backup process completed.");
    }
  };

  return (
    <button
      onClick={handleBackup}
      style={{
        padding: "10px 20px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Backup Now
    </button>
  );
};

export default BackupButton;
