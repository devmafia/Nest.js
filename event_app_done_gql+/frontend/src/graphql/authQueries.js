import { gql } from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      message
      token
      userId
    }
  }
`;

export const LOGIN_ADMIN = gql`
  mutation loginAdmin($input: LoginInput!) {
    login(input: $input) {
      message
      token
      userId
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      message
      token
      userId
    }
  }
`;
