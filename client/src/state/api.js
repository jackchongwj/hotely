import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    return headers;
  },
});

export const api = createApi({
  baseQuery,
  reducerPath: 'hotelApi',
  tagTypes: ['User', 'Dashboard', 'Reservations', 'Rooms', 'Guests', 'Inventory', 'Chat'],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `user/${id}`,
      providesTags: ['User'],
    }),
    getDashboard: build.query({
      query: () => 'dashboard',
      providesTags: ['Dashboard'],
    }),
    getReservations: build.query({
      query: () => 'reservations',
      providesTags: ['Reservations'],
    }),
    getRooms: build.query({
      query: () => 'rooms',
      providesTags: ['Rooms'],
    }),
    getGuests: build.query({
      query: () => 'guests',
      providesTags: ['Guests'],
    }),
    getInventory: build.query({
      query: () => 'inventory',
      providesTags: ['Inventory'],
    }),
    getChat: build.query({
      query: () => 'chat',
      providesTags: ['Chat'],
    }),
    // Example of a mutation if you need to add one
    addReservation: build.mutation({
      query: (reservation) => ({
        url: 'reservations',
        method: 'POST',
        body: reservation,
      }),
      invalidatesTags: ['Reservations'],
    }),
    // Example of updating a guest
    updateGuest: build.mutation({
      query: ({ id, ...rest }) => ({
        url: `guests/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Guests'],
    }),
    // Example of deleting a room
    deleteRoom: build.mutation({
      query: (id) => ({
        url: `rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rooms'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetReservationsQuery,
  useGetRoomsQuery,
  useGetGuestsQuery,
  useGetInventoryQuery,
  useGetChatQuery,
} = api;
