import React, { useState, useEffect } from "react";
import axios from "axios";

const Uploadprofile = () => {
  const [file, setFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    fetchProfileImage();
  }, []);

  // Fetch User Profile Picture
  const fetchProfileImage = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/getUserProfile", { withCredentials: true });
      if (res.data.profile?.filename) {
        setProfileImage(`http://localhost:8000/uploads/${res.data.profile.filename}`);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  
  if (!allowedTypes.includes(file.type)) {
    alert("Only image files (JPEG, JPG, PNG) are allowed!");
    return;
  }

  setFile(file);
  };

  // Handle File Upload
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/uploadfile", formData, { withCredentials: true });
      fetchProfileImage(); // Refresh profile image after upload
    } catch (error) {
      console.error("Error uploading file");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload Profile Picture</h2>
      
      {/* Display Profile Image */}
      {profileImage && (
        <div>
          <img src={profileImage} alt="Profile" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Uploadprofile;
