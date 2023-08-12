import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../../queryy/query";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  // 회원가입 폼의 상태 관리
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState(""); // Add nickName state
  const [decs, setDecs] = useState("");

  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Send the signup data to the server using the createUser mutation
      const createUserResponse = await createUser({
        variables: {
          userId: userId,
          password: password,
          createUserProfileInput: {
            nickName: nickName,
            decs: decs, // Use "userDecs" instead of "decs"
          },
        },
      });
      navigate("/login");
      // ... rest of the code
    } catch (error) {
      // ... error handling
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center">회원가입 폼</h1>
              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="userId">아이디:</label>
                  <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">비밀번호:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nickName">닉네임:</label>
                  <input
                    type="text"
                    id="nickName"
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userDecs">사용자 설명:</label>
                  <input
                    type="text"
                    id="userDecs"
                    value={decs}
                    onChange={(e) => setDecs(e.target.value)}
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  회원가입
                </button>
              </form>
              {error && <p>Error: {error.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
