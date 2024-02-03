import apolloClient from "src/boot/apollo";
import gql from "graphql-tag";
const context = {
  uri: "https://squid-app-yhzxp.ondigitalocean.app/graphql/system",
};

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    auth_login(email: $email, password: $password) {
      access_token
      refresh_token
      expires
    }
  }
`;

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refresh_token: String!) {
    auth_refresh(refresh_token: $refresh_token) {
      access_token
      refresh_token
      expires
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout($refresh_token: String!) {
    auth_logout(refresh_token: $refresh_token)
  }
`;

const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!, $reset_url: String) {
    auth_password_request(email: $email, reset_url: $reset_url)
  }
`;

const PASSWORD_RESET_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    auth_password_reset(token: $token, password: $password)
  }
`;

export function useAuthApi() {
  const login = async (email, password) => {
    const response = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
      context,
    });
    return response.data;
  };

  const refreshToken = async (refresh_token) => {
    const response = await apolloClient.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refresh_token },
      context,
    });
    return response.data;
  };

  const logout = async (refresh_token) => {
    const response = await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
      variables: { refresh_token },
      context,
    });
    return response.data;
  };

  const resetPassword = async (email, reset_url) => {
    const response = await apolloClient.mutate({
      mutation: REQUEST_PASSWORD_RESET_MUTATION,
      variables: { email, reset_url },
      context,
    });
    return response.data;
  };

  const setPassword = async (token, password) => {
    const response = await apolloClient.mutate({
      mutation: PASSWORD_RESET_MUTATION,
      variables: { token, password },
      context,
    });
    return response.data;
  };

  return { login, refreshToken, logout, resetPassword, setPassword };
}
