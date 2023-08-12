import { gql, useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CREATE_COMMENT,
  GET_COMMENTS,
  GET_LIKE,
  GET_LIKES_BY_POST_ID,
  GET_POST,
  GET_USER_PROFILE,
  TOGGLE_LIKE,
} from "../../queryy/query";
import { UserProfileView } from "./profile";
import React from "react";

const PostView = () => {
  const { postId } = useParams();
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(null);
  const [likeDataLoading, setLikeDataLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Assuming you have a token stored in localStorage after successful login
  const {
    loading: postLoading,
    error: postError,
    data: postData,
  } = useQuery(GET_POST, {
    variables: {
      postId: postId,
    },
  });

  const {
    loading: likeLoading,
    error: likeError,
    data: likeData,
  } = useQuery(GET_LIKE, {
    variables: {
      postId: postId,
      token: token,
    },
  });

  const {
    loading: commentLoading,
    error: commentError,
    data: commentData,
  } = useQuery(GET_COMMENTS, {
    variables: {
      postId: postId,
    },
  });

  const {
    loading: likesLoading,
    error: likesError,
    data: likesData,
  } = useQuery(GET_LIKES_BY_POST_ID, {
    variables: {
      postId: postId,
    },
  });

  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    // Update the cache after toggling like
    update(cache, { data: { toggleLike } }) {
      const postCacheId = cache.identify(postData.fetchPostbyPostId);
      cache.modify({
        id: postCacheId,
        fields: {
          likes(existingLikes) {
            // Return the updated number of likes based on the toggle result
            return toggleLike.like;
          },
        },
      });
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT, {
    update(cache, { data: { createComment } }) {
      cache.modify({
        id: cache.identify(postData.fetchPostbyPostId),
        fields: {
          comments(existingComments = []) {
            const newCommentRef = cache.writeFragment({
              data: createComment,
              fragment: gql`
                fragment NewComment on Comment {
                  id
                  userName
                  content
                }
              `,
            });
            return [...existingComments, newCommentRef];
          },
        },
      });
    },
  });

  const {
    loading: profileLoading,
    error: profileError,
    data: profileData,
  } = useQuery(GET_USER_PROFILE, {
    variables: {
      userId: postData?.fetchPostbyPostId?.userId, // Ensure the correct userId is provided
    },
    skip: !postData?.fetchPostbyPostId?.userId, // Skip the query if userId is not available
  });

  useEffect(() => {
    if (likeData && likeData.fetchLike) {
      setLiked(likeData.fetchLike.like === 1);
    }
    // Set loading state to false when likeData is available
    setLikeDataLoading(false);
  }, [likeData]);

  const handleCommentSubmit = () => {
    createComment({
      variables: {
        createCommentInput: {
          postId: postId,
          content: newComment,
        },
        token: localStorage.getItem("token"),
      },
    })
      .then((result) => {
        console.log("New comment created successfully:", result);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error creating new comment:", error);
      });
  };
  const handleEditPost = () => {
    navigate(`/editpost/${postId}`); // postId를 직접 경로에 포함하여 이동
  };
  const handleDeletePost = () => {
    navigate(`/deletepost/${postId}`); // postId를 직접 경로에 포함하여 이동
  };

  const haddleLogin = () => {
    navigate("/login");
  };

  const handleLikeToggle = () => {
    toggleLike({
      variables: {
        postId: postId,
        token: localStorage.getItem("token"),
      },
    })
      .then((result) => {
        console.log("Like toggled successfully:", result);
        setLiked(result.data.toggleLike.like);
      })
      .catch((error) => {
        console.error("Error toggling like:", error);
      });
  };

  if (postLoading || likeLoading || profileLoading || likesLoading)
    return <p>Loading...</p>;
  if (postError) return <p>Error: {postError.message}</p>;
  //   if (likeError) return <p>Error: {likeError.message}</p>;
  if (profileError) return <p>Error: {profileError.message}</p>;
  if (likesError) return <p>Error: {likesError.message}</p>;

  const post = postData?.fetchPostbyPostId;
  const comments = commentData?.fetchComments || []; // `commentData` 변수명 변경

  const userProfile = profileData?.fetchUserProfile;
  const likeCount = likesData?.likesByPostId; // 좋아요 수 가져오기
  const loginUserDataString = localStorage.getItem("user-data");
  const loginUserData = JSON.parse(loginUserDataString);
  const isSelfPost = post?.userName === loginUserData?.tokenChecking?.id;
  return (
    <div className="container mt-4 border p-4">
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-3">
            <h2>{post?.title}</h2>
            <div className="ms-auto">
              <UserProfileView userId={post?.userName} />
              <p className="text-muted mb-0 me-3">
                Created at:{" "}
                {post?.createdAt && new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
            {isSelfPost && (
              <div>
                <button
                  className="btn btn-primary me-2"
                  onClick={handleEditPost}
                >
                  Edit
                </button>
                <button className="btn btn-danger" onClick={handleDeletePost}>
                  Delete
                </button>
              </div>
            )}
          </div>
          <p>{post?.content}</p>

          {token ? (
            <div>
              <div className="d-flex align-items-center">
                <p className="me-3 mb-0">Likes: {likeCount}</p>
                <button
                  onClick={handleLikeToggle}
                  className={`btn btn-${liked ? "danger" : "primary"} btn-sm`}
                >
                  {liked ? "Unlike" : "Like"}
                </button>
              </div>
              <h4>Add a Comment</h4>
              <div className="input-group mb-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="form-control"
                  placeholder="Write your comment here..."
                />
                <button
                  onClick={handleCommentSubmit}
                  className="btn btn-primary"
                  type="button"
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div onClick={haddleLogin}>로그인해야 댓글을 쓸수 있습니다</div>
          )}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-8">
          <h3>Comments</h3>
          {comments.length === 0 ? (
            <p>No comments</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="my-3 border rounded p-3">
                <UserProfileView userId={comment?.userName} />
                <p>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-8"></div>
      </div>
    </div>
  );
};

export default PostView;
