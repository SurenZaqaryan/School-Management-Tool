import { gql } from '@apollo/client';

export const GET_SUBJECTS = gql`
  query {
    getSubjects {
      id
      name
    }
  }
`;

export const GET_TEACHER_AND_SUBJECTS = gql`
  query ($id: ID!) {
    getTeacher(id: $id) {
      id
      name
      subjects {
        id
        name
      }
    }
    getSubjects {
      id
      name
    }
  }
`;

export const GET_TEACHERS = gql`
  query {
    getTeachers {
      id
      name
      subjects {
        id
        name
      }
    }
  }
`;

export const GET_TEACHER = gql`
  query ($id: ID!) {
    getTeacher(id: $id) {
      id
      name
      subjects {
        id
        name
      }
    }
  }
`;
