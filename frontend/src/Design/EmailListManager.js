import React, { useState, useEffect } from "react";

const EmailListManager = () => {
  const [emailList, setEmailList] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch email list when component mounts
  useEffect(() => {
    const fetchEmailList = async () => {
      try {
        const response = await fetch("http://localhost:5002/emailList");
        const data = await response.json();
        if (data.success) {
          setEmailList(data.emailList);
        }
      } catch (error) {
        setError("Failed to fetch email list.");
      }
    };
    fetchEmailList();
  }, []);

  // Add email to the list
  const handleAddEmail = async () => {
    if (!newEmail) {
      setError("Email cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/emailList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add",
          email: newEmail,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEmailList(data.emailList);
        setNewEmail(""); // Clear input field
        setError(""); // Reset error message
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to add email.");
    }
    setLoading(false);
  };

  // Remove email from the list
  const handleRemoveEmail = async (email) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5002/emailList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "remove",
          email,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEmailList(data.emailList);
        setError(""); // Reset error message
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to remove email.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Email List Manager</h2>
      <div>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter email to add"
        />
        <button onClick={handleAddEmail} disabled={loading}>
          {loading ? "Adding..." : "Add Email"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>Current Email List</h3>
      <ul>
        {emailList.map((email) => (
          <li key={email}>
            {email}
            <button onClick={() => handleRemoveEmail(email)} disabled={loading}>
              {loading ? "Removing..." : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailListManager;
