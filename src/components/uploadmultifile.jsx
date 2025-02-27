import React, { useState } from "react";
import axios from "axios";

const UploadMultipleImages = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!files.length) {
      alert("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://localhost:8000/api/uploadmultifile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.msg);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    }
  };

  return (
    <div>
      <h2>Upload Multiple Images</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadMultipleImages;
