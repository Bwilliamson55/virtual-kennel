import gql from "graphql-tag";
import apolloClient from "src/boot/apollo";

const HOUNDS_FIELDS_FRAGMENT = gql`
  fragment HoundFields on vk_dogs {
    whelp_date
    whelp_date_func {
      year
      month
      week
      day
      weekday
    }
    next_race_date
    next_race_date_func {
      year
      month
      week
      day
      weekday
    }
    color
    sex
    url
    left_tattoo
    dam
    sire
    name
    right_tattoo
    starts
    next_race_details
    id
  }
`;

const GET_HOUNDS_AGGREGATED_QUERY = gql`
  {
    vk_dogs_aggregated {
      group
      countAll
      count {
        whelp_date
        next_race_date
        color
        sex
        url
        left_tattoo
        dam
        sire
        name
        right_tattoo
        starts
        next_race_details
        id
      }
      countDistinct {
        whelp_date
        next_race_date
        color
        sex
        url
        left_tattoo
        dam
        sire
        name
        right_tattoo
        starts
        next_race_details
        id
      }
    }
  }
`;

const GET_HOUNDS_QUERY = gql`
  ${HOUNDS_FIELDS_FRAGMENT}
  query GetHounds(
    $filter: vk_dogs_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    vk_dogs(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
    ) {
      ...HoundFields
    }
  }
`;

const GET_CURRENT_USER_HOUNDS_QUERY = gql`
  ${HOUNDS_FIELDS_FRAGMENT}
  query GetCurrentUserHounds(
    $filter: vk_user_hounds_filter
    $sort: [String]
    $limit: Int
    $offset: Int
    $page: Int
    $search: String
  ) {
    vk_user_hounds(
      filter: $filter
      sort: $sort
      limit: $limit
      offset: $offset
      page: $page
      search: $search
    ) {
      id
      hound_id {
        ...HoundFields
      }
    }
  }
`;

export function useHoundsApi() {
  const getHounds = async ({ filter, sort, limit, offset, page, search }) => {
    const response = await apolloClient.query({
      query: GET_HOUNDS_QUERY,
      variables: { filter, sort, limit, offset, page, search },
    });
    return response.data.vk_dogs;
  };

  const getHoundsAggregated = async () => {
    const response = await apolloClient.query({
      query: GET_HOUNDS_AGGREGATED_QUERY,
    });
    return response.data.vk_dogs_aggregated;
  };

  const getCurrentUserHounds = async ({
    filter,
    sort,
    limit,
    offset,
    page,
    search,
  }) => {
    const response = await apolloClient.query({
      query: GET_CURRENT_USER_HOUNDS_QUERY,
      variables: { filter, sort, limit, offset, page, search },
    });
    return response.data.vk_user_hounds;
  };

  return {
    getHounds,
    getHoundsAggregated,
    getCurrentUserHounds,
  };
}
