import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PostList from "./components/readposts/posts";
import NavigationBar from "./components/nevigation/NavigationBar";
import { LoginForm } from "./components/login/login";
import SignupForm from "./components/login/signup";
import CreatePostForm from "./components/readposts/createposts";
import Postview from "./components/readposts/postview";
import TokenChecker from "./components/login/tokencheck";
import { UserProvider } from "./components/provider/usercontext";
import { LOGIN, TOKEN_CHECK_QUERY } from "./queryy/query";
import { useApolloClient } from "@apollo/client";
import Profile from "./components/profile/profile";
import EditPostForm from "./components/readposts/managepost/editpost";
import DeletePostForm from "./components/readposts/managepost/deletepost";

function Home() {
  return <div>홈 페이지</div>;
}

function About() {
  return <div>컴퓨터 훔치라고 만든 사이트 </div>;
}

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <UserProvider>
      <Router>
        <div>
          <TokenChecker setUserData={setUserData} />
          <NavigationBar />
          <div className="container">
            {/* 라우팅 설정 */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<PostList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signUp" element={<SignupForm />} />
              <Route path="/create-post" element={<CreatePostForm />} />
              <Route path="/contact/:postId" element={<Postview />} />
              <Route
                path="/profile"
                element={<Profile userData={userData} />}
              />
              <Route path="/editpost/:postId" element={<EditPostForm />} />
              <Route path="/deletepost/:postId" element={<DeletePostForm />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
