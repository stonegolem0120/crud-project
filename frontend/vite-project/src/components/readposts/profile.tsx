import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "../../queryy/query";
import "./post.css";

export const UserProfile = ({ userId }) => {
  const [userName, setUserName] = useState(null);
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId: userId,
    },
  });

  useEffect(() => {
    if (data && data.fetchUserProfile) {
      setUserName(data.fetchUserProfile.userName);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="user-profile">
      <p>{userName}</p>
    </div>
  );
};

export const UserProfileView = ({ userId }) => {
  const [userName, setUserName] = useState(null);
  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId: userId,
    },
  });

  useEffect(() => {
    if (data && data.fetchUserProfile) {
      setUserName(data.fetchUserProfile.userName);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>{userName}</p>
    </div>
  );
};
