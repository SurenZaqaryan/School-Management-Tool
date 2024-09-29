import { gql } from '@apollo/client';

// LOGIN / SIGNUP
export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      message
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

// TEACHER
export const ADD_TEACHER = gql`
  mutation AddTeacher($name: String!, $subjectIds: [ID!]!) {
    addTeacher(name: $name, subjectIds: $subjectIds) {
      id
      name
      subjects {
        id
        name
      }
    }
  }
`;

export const UPDATE_TEACHER = gql`
  mutation ($id: ID!, $name: String!, $subjectIds: [ID!]!) {
    updateTeacher(id: $id, name: $name, subjectIds: $subjectIds) {
      id
      name
      subjects {
        id
        name
      }
    }
  }
`;

export const DELETE_TEACHER = gql`
  mutation DeleteTeacher($id: ID!) {
    deleteTeacher(id: $id)
  }
`;

export const ADD_PUPIL = gql`
  mutation ($name: String!, $grade: Int!, $subjectIds: [ID!]!) {
    addPupil(name: $name, grade: $grade, subjectIds: $subjectIds)
  }
`;

export const UPDATE_PUPIL = gql`
  mutation UpdatePupil($id: ID!, $name: String!, $grade: Int!, $subjectIds: [ID!]!) {
    updatePupil(id: $id, name: $name, grade: $grade, subjectIds: $subjectIds) {
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

export const DELETE_PUPIL = gql`
  mutation DeletePupil($id: ID!) {
    deletePupil(id: $id)
  }
`;
