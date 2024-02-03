import {
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";
import { setContext } from "apollo-link-context";
import { useAuthStore } from "src/stores/auth";

const httpLink = new ApolloLink((operation, forward) => {
  const { getContext } = operation;
  const { uri } = getContext();
  // accept context from the composables for instance /graphql/system
  const link = createHttpLink({
    uri: uri || "https://squid-app-yhzxp.ondigitalocean.app/graphql",
  });

  return link.request(operation, forward);
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = useAuthStore().currentToken;
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
