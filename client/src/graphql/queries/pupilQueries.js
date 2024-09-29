import { gql } from '@apollo/client';

export const GET_PUPILS_WITH_SUBJECTS = gql`
  query {
    getPupils {
      id
      name
      grade
      subjects {
        id
        name
      }
    }
  }
`;
