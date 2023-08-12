import { useState } from "react";
import { useMutation } from "@apollo/client";

import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_POST } from "../../../queryy/query";
// 글 생성 폼 컴포넌트
type EditPostFormProps = {
  postId: string; // 또는 다른 타입으로 지정
};

function EditPostForm() {
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [updatePost, { loading, error }] = useMutation(UPDATE_POST);
  const navigate = useNavigate();

  const handleUpdatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("로그인이 필요합니다.");
        return;
      }

      const updatePostInput = {
        title: title,
        content: content,
      };

      const { data } = await updatePost({
        variables: {
          updatePostInput: updatePostInput,
          token: token,
          postId: postId, // Using the prop directly
        },
      });

      // Handle successful post creation (e.g., show success message)
      console.log("글이 성공적으로 수정되었습니다:", data.createPost);

      // Reset form fields after successful creation
      setTitle("");
      setContent("");

      // Navigate to the /contact/:postId route after post creation
      navigate(`/contact/${postId}`);
    } catch (error) {
      console.error("글 생성 실패:", error);
    }
  };
  console.log(postId);
  return (
    <form
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
      onSubmit={handleUpdatePostSubmit}
    >
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="title" style={{ marginRight: "10px" }}>
          제목:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "5px",
            borderRadius: "3px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="content" style={{ marginRight: "10px" }}>
          내용:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "5px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            fontSize: "16px", // Increase font size
            height: "200px", // Increase content area height
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        글 수정
      </button>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Error: {error.message}
        </p>
      )}
    </form>
  );
}
export default EditPostForm;
