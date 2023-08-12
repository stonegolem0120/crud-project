import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

const client = new ApolloClient({
  uri: "http://125.133.252.77:4000/graphql", // 여기에 GraphQL 서버의 엔드포인트 URL을 넣어주세요.
  cache: new InMemoryCache(),
});

// 최상위 컴포넌트(App 등)를 ApolloProvider로 감싸줍니다.
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
