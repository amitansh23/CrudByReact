import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
  
    const storedUser = localStorage.getItem("userData");
    const storedProfile = localStorage.getItem("userProfile");

    if (storedUser && storedProfile) {
      const user = JSON.parse(storedUser);
      const profile = JSON.parse(storedProfile);
      console.log(profile,user)

     
      const imageUrl = `http://localhost:8000/uploads/${profile.filename}`;
      setProfileImage(imageUrl);
    }
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
      ) : (
        <p>No Profile Picture</p>
      )}
    </div>
  );
};

export default Profile;
