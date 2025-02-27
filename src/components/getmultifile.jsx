import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getmultifile", { withCredentials: true });
      setImages(response.data.images); 
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {images.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {images.map((img, index) => (
            <img key={index} src={img} alt="User Upload" style={{ width: "150px", height: "150px", borderRadius: "10px" }} />
          ))}
        </div>
      ) : (
        <p>No Images Found</p>
      )}
    </div>
  );
};

export default Profile;
