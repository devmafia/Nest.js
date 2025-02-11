import { gql } from 'graphql-tag';

export const FETCH_USER_DATA = gql`
  query FetchUserData ($id: Int!) {
    getUserdata(userId: $id) {
      user {
        id
        username
        email
      }
    }
  }
`;

export const FETCH_USER_BOOKINGS = gql`
  query FetchUserBookings ($id: Float!) {
    getBookings(userId: $id) {
      id
      guestName
      guestEmail
      phone
      totalPrice
      events {
        id
        title
        description
        price
        image
        date
      }
      seats {
        id
        seatNumber
        eventId
      }
    }
  }
`;

export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($variables: UpdateUsernameInput!) {
    updateUsername(variables: $variables) {
      user {
        id
        username
      }
    }
  }
`;

export const UPDATE_EMAIL = gql`
  mutation UpdateEmail($variables: UpdateEmailInput!) {
    updateEmail(variables: $variables) {
      user {
        id
        email
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($variables: UpdatePasswordInput!) {
    updatePassword(variables: $variables)
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($variables: DeleteUserDto!) {
    deleteUser(variables: $variables)
  }
`;

export const DELETE_BOOKING = gql`
  mutation DeleteBooking($variables: DeleteBookingDto!) {
    deleteBooking(variables: $variables)
  }
`;
