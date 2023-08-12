import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../queryy/query";
import { useNavigate } from "react-router-dom";

// Define the type for the response of the login mutation
interface LoginResponse {
  login: string;
}

// 로그인 폼 컴포넌트
export function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [
    login,
    //  { loading: loginLoading, error: loginError }, //
  ] = useMutation<
    LoginResponse,
    // Define the type for the variables passed to the login mutation
    { userId: string; password: string }
  >(LOGIN);
  const navigate = useNavigate();
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: {
          userId: userId,
          password: password,
        },
      });

      // Access the token from the response
      const token: string | undefined = data?.login;
      const tokenToStore: string = token || ""; // If 'token' is undefined, set it to an empty string.

      localStorage.setItem("token", tokenToStore);

      // Handle successful login (e.g., redirect to another page)
      // ...
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center">로그인</h1>
              <form onSubmit={handleLoginSubmit}>
                {/* 로그인 폼 입력 필드 및 제출 버튼을 작성합니다. */}
                <div className="form-group">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="form-control"
                    placeholder="아이디"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="비밀번호"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  로그인
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
