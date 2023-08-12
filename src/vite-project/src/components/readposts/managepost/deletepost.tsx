import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { DELETE_POST } from "../../../queryy/query";

function DeletePostForm() {
  const { postId } = useParams(); // postId를 동적 파라미터로 받아옴
  const [deletePost, { loading, error }] = useMutation(DELETE_POST);
  const navigate = useNavigate();

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("로그인이 필요합니다.");
        return;
      }

      const { data } = await deletePost({
        variables: {
          token: token,
          postId: postId, // postId를 사용하여 삭제할 게시물 식별
        },
      });

      // Handle successful post deletion (e.g., show success message)
      console.log("글이 성공적으로 삭제되었습니다:", data.deletePost);

      // Navigate to the /contact route after post deletion
      navigate("/contact");
    } catch (error) {
      console.error("글 삭제 실패:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h2 className="card-title">게시물 삭제</h2>
        <p className="card-text">정말로 이 게시물을 삭제하시겠습니까?</p>
        <button
          onClick={handleDeletePost}
          disabled={loading}
          className="btn btn-danger"
        >
          삭제하기
        </button>
        {error && <p className="text-danger mt-3">Error: {error.message}</p>}
      </div>
    </div>
  );
}

export default DeletePostForm;
