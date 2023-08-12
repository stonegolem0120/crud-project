import { useEffect, useState } from "react";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_POST,
  GET_ALL_POSTS,
  GET_POST_COUNT,
  GET_USER_PROFILE,
} from "../../queryy/query";

import Pagination from "./pagenation";
import "bootstrap/dist/css/bootstrap.min.css";
import "./post.css";
import CreatePostForm from "./createposts";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "./profile";

const pageSize = 12; // Number of posts per page

interface CreatePostFormProps {
  onPostSubmit: (post: unknown) => void;
}

const PostList = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [userProfileData, setUserProfileData] = useState(null);
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const navigate = useNavigate();
  // Fetch total post count
  const { loading: countLoading, data: countData } = useQuery(GET_POST_COUNT);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (countData) {
      const totalCount = countData.fetchPostCount;
      setTotalPages(Math.ceil(totalCount / pageSize));
    }
  }, [countData]);

  // Fetch posts for the current page
  const { loading, error, data } = useQuery(GET_ALL_POSTS, {
    variables: {
      page: currentPage,
      pageSize,
    },
  });

  // Use useLazyQuery to fetch user profile
  const [getUserProfile, { loading: userProfileLoading }] = useLazyQuery(
    GET_USER_PROFILE,
    {
      onCompleted: (userData) => {
        setUserProfileData(userData); // Update userProfileData state when data is fetched
      },
    }
  );

  useEffect(() => {
    // Fetch user profile for each post's userId
    if (!loading && data) {
      data.fetchPosts.forEach((post) => {
        getUserProfile({
          variables: {
            userId: post.userId,
          },
        });
      });
    }
  }, [data, loading, getUserProfile]);

  // CreatePost Mutation
  const [createPost] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      // After creating a new post, we can update the cache to include the new post in the list
      cache.modify({
        fields: {
          fetchPosts(existingPosts = [], { readField }) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                  title
                  content
                  createdAt
                  userName
                }
              `,
            });
            return [newPostRef, ...existingPosts];
          },
        },
      });
    },
  });

  // Handle loading and error states
  if (countLoading || loading || userProfileLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { fetchPosts } = data;

  const handleWritePost = () => {
    navigate("/create-post");
  };

  const handlePostSubmit = (post) => {
    createPost({
      variables: {
        createPostInput: {
          title: post.title,
          content: post.content,
        },
        token: localStorage.getItem("token"), // Assuming you have a token stored in localStorage after successful login
      },
    })
      .then(() => {
        console.log("New Post created successfully!");
        setShowCreatePostForm(false); // Hide the CreatePostForm after successful post creation
      })
      .catch((error) => {
        console.error("Error creating new post:", error);
      });
  };

  const handlePostClick = (postId) => {
    // Replace '/contact' with the path to your PostView component
    navigate(`/contact/${postId}`);
  };

  const handdleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {showCreatePostForm ? (
            <CreatePostForm />
          ) : (
            <>
              <h1 className="my-4">Post List</h1>
              {token ? (
                <button
                  className="btn btn-primary mb-3" // Use the btn and btn-primary classes for the button
                  onClick={handleWritePost}
                >
                  Write Post
                </button>
              ) : (
                <div onClick={handdleLogin}>
                  로그인을 하셔야 모든기능을 쓸수있습니다
                </div>
              )}
              <div className="posts-container">
                {/* ... (rest of the code) */}
              </div>
              <div className="posts-container">
                {fetchPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="post border p-3 mb-3 bg-light" // Use Bootstrap classes for styling
                    onClick={() => handlePostClick(post.id)}
                  >
                    <div className="post-details">
                      <p className="post-number">{index + 1}</p>
                      <p className="post-title">{post.title}</p>
                      <p className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <UserProfile userId={post.userName} />
                  </div>
                ))}
              </div>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostList;
