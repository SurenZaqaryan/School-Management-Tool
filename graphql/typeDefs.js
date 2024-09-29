import { gql } from 'graphql-tag';

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type SignupPayload {
    message: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Teacher {
    id: ID!
    name: String!
    subjects: [Subject!]!
  }

  type Pupil {
    id: ID!
    name: String!
    grade: Int!
    subjects: [Subject!]!
  }

  type Subject {
    id: ID!
    name: String!
    teachers: [Teacher!]!
  }

  type Query {
    getTeacher(id: ID!): Teacher
    getTeachers: [Teacher!]!
    getPupils: [Pupil!]!
    getSubjects: [Subject!]!
  }

  type Mutation {
    signup(email: String!, password: String!): SignupPayload!
    login(email: String!, password: String!): AuthPayload!

    addTeacher(name: String!, subjectIds: [ID!]!): Teacher!
    updateTeacher(id: ID!, name: String!, subjectIds: [ID!]!): Teacher
    deleteTeacher(id: ID!): Boolean!

    addPupil(name: String!, grade: Int!, subjectIds: [ID!]!): Boolean!
    updatePupil(id: ID!, name: String!, grade: Int!, subjectIds: [ID!]!): Pupil!
    deletePupil(id: ID!): Boolean!

    addSubject(name: String!): Subject!
    updateSubject(id: ID!, name: String!): Subject!
    deleteSubject(id: ID!): Boolean!
  }
`;

export default typeDefs;
