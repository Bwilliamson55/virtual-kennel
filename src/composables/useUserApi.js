import apolloClient from "src/boot/apollo";
import gql from "graphql-tag";
const context = {
  uri: "https://squid-app-yhzxp.ondigitalocean.app/graphql/system",
};
/**
 * Example user object:
{
	"id": "0bc7b36a-9ba9-4ce0-83f0-0a526f354e07",
	"first_name": "Admin",
	"last_name": "User",
	"email": "admin@example.com",
	"password": "**********",
	"location": "New York City",
	"title": "CTO",
	"description": null,
	"tags": null,
	"avatar": null,
	"language": "en-US",
	"appearance": "auto",
	"tfa_secret": null,
	"status": "active",
	"role": "653925a9-970e-487a-bfc0-ab6c96affcdc",
	"token": null,
	"last_access": "2021-02-05T10:18:13-05:00",
	"last_page": "/settings/roles/653925a9-970e-487a-bfc0-ab6c96affcdc"
}
 */

const USER_FIELDS_FRAGMENT = gql`
  fragment UserFields on directus_users {
    id
    role {
      id
      name
      icon
      description
      app_access
      admin_access
      enforce_tfa
    }
    avatar {
      id
      modified_on
      uploaded_on
      embed
      charset
      type
      title
      filename_download
      filename_disk
      storage
      metadata
      description
      location
      tags
      duration
      height
      width
      filesize
    }
    last_access
    appearance
    external_identifier
    provider
    last_page
    token
    status
    tfa_secret
    language
    title
    location
    password
    email
    last_name
    first_name
    auth_data
    tags
    description
    email_notifications
  }
`;

const LIST_USERS_QUERY = gql`
  ${USER_FIELDS_FRAGMENT}
  query {
    users {
      id
      first_name
      last_name
      email
    }
  }
`;

const GET_USER_BY_ID_QUERY = gql`
  ${USER_FIELDS_FRAGMENT}
  query GetUserById($id: ID!) {
    users_by_id(id: $id) {
      ...UserFields
    }
  }
`;

const GET_CURRENT_USER_QUERY = gql`
  ${USER_FIELDS_FRAGMENT}
  query {
    users_me {
      ...UserFields
    }
  }
`;

const UPDATE_CURRENT_USER_MUTATION = gql`
  ${USER_FIELDS_FRAGMENT}
  mutation update_users_me($data: update_directus_users_input!) {
    update_users_me(data: $data) {
      ...UserFields
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  ${USER_FIELDS_FRAGMENT}
  mutation create_users_item($data: create_directus_users_input!) {
    create_users_item(data: $data) {
      ...UserFields
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  ${USER_FIELDS_FRAGMENT}
  mutation update_users_item($id: ID!, $data: update_directus_users_input!) {
    update_users_item(id: $id, data: $data) {
      ...UserFields
    }
  }
`;

const INVITE_USER_MUTATION = gql`
  mutation users_invite($email: String!, $role: String!, $invite_url: String) {
    users_invite(email: $email, role: $role, invite_url: $invite_url)
  }
`;

const ACCEPT_INVITE_MUTATION = gql`
  mutation users_invite_accept($token: String!, $password: String!) {
    users_invite_accept(token: $token, password: $password)
  }
`;

export function useUserApi() {
  const listUsers = async () => {
    const response = await apolloClient.query({
      query: LIST_USERS_QUERY,
      context,
    });
    return response.data.users;
  };

  const getUserById = async (id) => {
    const response = await apolloClient.query({
      query: GET_USER_BY_ID_QUERY,
      variables: { id },
      context,
    });
    return response.data.users_by_id;
  };

  const getCurrentUser = async () => {
    const response = await apolloClient.query({
      query: GET_CURRENT_USER_QUERY,
      context,
    });
    return response.data.users_me;
  };

  const updateUser = async (id, data) => {
    const response = await apolloClient.mutate({
      mutation: UPDATE_USER_MUTATION,
      variables: { id, data },
      context,
    });
    return response.data.update_users_item;
  };

  const updateCurrentUser = async (data) => {
    const response = await apolloClient.mutate({
      mutation: UPDATE_CURRENT_USER_MUTATION,
      variables: { data },
      context,
    });
    return response.data.update_users_me;
  };

  const createUser = async (data) => {
    const response = await apolloClient.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: { data },
      context,
    });
    return response.data.create_users_item;
  };

  const inviteUser = async (email, role, invite_url) => {
    const response = await apolloClient.mutate({
      mutation: INVITE_USER_MUTATION,
      variables: { email, role, invite_url },
      context,
    });
    return response.data.users_invite;
  };

  const acceptInvite = async (token, password) => {
    const response = await apolloClient.mutate({
      mutation: ACCEPT_INVITE_MUTATION,
      variables: { token, password },
      context,
    });
    return response.data.users_invite_accept;
  };

  return {
    listUsers,
    getUserById,
    getCurrentUser,
    updateUser,
    updateCurrentUser,
    createUser,
    inviteUser,
    acceptInvite,
  };
}
