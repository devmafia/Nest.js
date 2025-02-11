// queries.js
import { gql } from 'graphql-tag';

export const FETCH_EVENTS = gql`
  query GetEvents {
    getAllEvents {
      id
      title
      description
      date
      category
      place
      price
      availableSeats
      image
    }
  }
`;

export const GET_EVENT_DETAILS = gql`
  query GetEventDetails($id: Int!) {
    getEvent(id: $id) {
      id
      title
      date
      description
      price
      image
      place
      category
      seats {
        id
        seatNumber
        isBooked
      }
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;
