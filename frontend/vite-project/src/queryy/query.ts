import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query GetAllPosts($page: Int!, $pageSize: Int!) {
    fetchPosts(page: $page, pageSize: $pageSize) {
      id
      userName
      title
      content
      like
      createdAt
    }
  }
`;
export const GET_POST = gql`
  query GetPost($postId: String!) {
    fetchPostbyPostId(postID: $postId) {
      id
      userName
      title
      content
      createdAt
    }
  }
`;

export const GET_POST_COUNT = gql`
  query GetPostCount {
    fetchPostCount
  }
`;
export const TOKEN_CHECK_QUERY = gql`
  query TokenCheck($token: String!) {
    tokenChecking(token: $token) {
      id
      userId
      userName
      userDecs
    }
  }
`;
export const GET_LIKE = gql`
  query GetLike($token: String!, $postId: String!) {
    fetchLike(token: $token, postId: $postId) {
      like
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    fetchUserProfile(userId: $userId) {
      userId
      userName
      userDecs
    }
  }
`;

export const GET_COMMENTS = gql`
  query GetComments($postId: String!) {
    fetchComments(postId: $postId) {
      id
      userName
      postId
      content
    }
  }
`;

export const GET_COMMENT = gql`
  query GetComment($commentId: String!) {
    fetchComment(commentId: $commentId) {
      id
      userName
      postId
      content
    }
  }
`;

export const GET_LIKES_BY_POST_ID = gql`
  query GetLikesByPostId($postId: String!) {
    likesByPostId(postId: $postId)
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($createPostInput: createPostInput!, $token: String!) {
    createPost(createPostInput: $createPostInput, token: $token) {
      id
      userName
      title
      content
      like
      createdAt
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost(
    $token: String!
    $postId: String!
    $updatePostInput: createPostInput!
  ) {
    updatePost(
      token: $token
      postId: $postId
      updatePostInput: $updatePostInput
    ) {
      id
      userName
      title
      content
      like
      createdAt
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($token: String!, $postId: String!) {
    deletePost(token: $token, postId: $postId)
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $createCommentInput: createCommentInput!
    $token: String!
  ) {
    createComment(createCommentInput: $createCommentInput, token: $token) {
      id
      userName
      postId
      content
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment(
    $token: String!
    $commentId: String!
    $updateCommentInput: updateCommentInput!
  ) {
    updateComment(
      token: $token
      commentId: $commentId
      updateCommentInput: $updateCommentInput
    ) {
      id
      userName
      postId
      content
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($token: String!, $commentId: String!) {
    deleteComment(token: $token, commentId: $commentId)
  }
`;

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($token: String!, $postId: String!) {
    toggleLike(token: $token, postId: $postId) {
      id
      userId
      postId
      like
    }
  }
`;

export const LOGIN = gql`
  mutation Login($userId: String!, $password: String!) {
    login(userId: $userId, password: $password)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $userId: String!
    $password: String!
    $createUserProfileInput: CreateUserProfileInput!
  ) {
    createUser(
      userId: $userId
      password: $password
      createUserProfileInput: $createUserProfileInput
    ) {
      id
      userId
      userName
      userDecs # Use "decs" instead of "userDecs"
    }
  }
`;
