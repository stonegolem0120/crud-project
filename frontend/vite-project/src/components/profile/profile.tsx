import React from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  userDecs: string;
  userId: string;
  userName: string;
  // Add other user data as needed
}

interface ProfileProps {
  userData: UserProfile | null; // Make userData nullable
}

const Profile: React.FC<ProfileProps> = ({ userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    // For example, you can clear the user data from the state and local storage,
    // and then redirect the user to the login page
    // ...
    // For now, let's assume we just remove the token from local storage and redirect to the login page

    localStorage.removeItem("token");
    localStorage.removeItem("user-data");
    navigate("/");
  };

  // Check if userData is null or undefined
  if (!userData) {
    return <div>Loading...</div>; // or any other UI for the loading state
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center">User Profile</h2>
              <p>
                <strong>닉네임:</strong> {userData.userName}
              </p>
              <p>
                <strong>유저설명:</strong> {userData.userDecs}
              </p>
              <p>
                <strong>아이디:</strong> {userData.userId}
              </p>
              {/* Add other user information here */}
              <button
                className="btn btn-primary btn-block"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
