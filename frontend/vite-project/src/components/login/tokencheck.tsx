// TokenChecker.js
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";
import { TOKEN_CHECK_QUERY } from "../../queryy/query";
import { useUser } from "../provider/usercontext";

const TokenChecker = ({ setUserData }) => {
  // Receive setUserData as a prop
  const client = useApolloClient();
  const { isLoggedIn, setIsLoggedIn } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token is not present.");
      setIsLoggedIn(false);
      return;
    }

    client
      .query({
        query: TOKEN_CHECK_QUERY,
        variables: { token: token },
      })
      .then((response) => {
        console.log("User is already logged in:", response.data);
        setIsLoggedIn(true);
        // Set the userData state with the user profile data
        setUserData(response.data.tokenChecking);
        localStorage.setItem("user-data", JSON.stringify(response.data));
        return response.data;
      })
      .catch((error) => {
        console.error("Invalid token:", error.message);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      });
  }, [client, setIsLoggedIn, setUserData]); // Include setUserData in the dependency array

  return null;
};

export default TokenChecker;
