import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "hotelApi",
  tagTypes: ["User", "Dashboard, Reservations", "Rooms", "Guests", "Inventory", "Chat"],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getDashboard: build.query({
      query: () => "dashboard",
      providesTags: ["Dashboard"],
    }),
    getReservations: build.query({
      query: () => "reservations",
      providesTags: ["Reservations"],
    }),
    getRooms: build.query({
      query: () => "rooms",
      providesTags: ["Rooms"],
    }),
    getGuests: build.query({
      query: () => "guests",
      providesTags: ["Guests"],
    }),
    getInventory: build.query({
      query: () => "inventory",
      providesTags: ["Inventory"],
    }),
    getChat: build.query({
      query: () => "chat",
      providesTags: ["Chat"],
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