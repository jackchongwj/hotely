# Hotely Database Schema

This document outlines the proposed database structure for the Hotely Management System based on the analysis of the frontend components and data flow.

## 1. Guests Table
Stores information about the people staying at the hotel.
- **id** (Primary Key): Unique identifier for the guest.
- **firstName** (String): Guest's first name.
- **lastName** (String): Guest's last name.
- **email** (String, Unique): Contact email address.
- **phone** (String): Contact phone number.
- **idType** (Enum): `passport`, `drivingLicense`, `nationalId`.
- **idNumber** (String): Identification document number.
- **visits** (Integer): Total number of stays at the hotel.
- **status** (Enum): `checked-in`, `checked-out`, `booked`.
- **isVip** (Boolean): VIP status flag.
- **createdAt** / **updatedAt** (Timestamps).

## 2. Rooms Table
Manages the hotel's physical room inventory and current status.
- **id** (Primary Key): Room number.
- **type** (Enum): `Standard`, `Deluxe`, `Suite`, `Executive`.
- **status** (Enum): `vacant`, `occupied`, `reserved`, `maintenance`.
- **cleaningStatus** (Enum): `clean`, `dirty`, `pending`.
- **pricePerNight** (Decimal): Base rate for the room.
- **description** (Text): Details about room amenities.
- **createdAt** / **updatedAt** (Timestamps).

## 3. Reservations Table
The core entity linking Guests to Rooms for a specific date range.
- **id** (Primary Key): Unique booking identifier.
- **guestId** (Foreign Key -> Guests): Reference to the guest who made the booking.
- **roomId** (Foreign Key -> Rooms, Nullable): Reference to the assigned room.
- **roomTypeRequested** (String): The category of room requested during booking.
- **checkInDate** (Date): Planned arrival date.
- **checkOutDate** (Date): Planned departure date.
- **adults** (Integer): Number of adults.
- **children** (Integer): Number of children.
- **specialRequests** (Text): Guest requests (e.g., "high floor").
- **status** (Enum): `pending`, `confirmed`, `checked-in`, `checked-out`, `cancelled`.
- **createdAt** / **updatedAt** (Timestamps).

## 4. ReservationServices Table
Tracks additional add-ons requested during the booking.
- **id** (Primary Key).
- **reservationId** (Foreign Key -> Reservations).
- **hasBreakfast** (Boolean).
- **hasParking** (Boolean).
- **hasExtraBed** (Boolean).

## 5. Invoices Table
Handles the billing and financial transactions for a stay.
- **id** (Primary Key): Invoice number (e.g., 'INV-1001').
- **reservationId** (Foreign Key -> Reservations).
- **guestId** (Foreign Key -> Guests).
- **amount** (Decimal): Total billable amount.
- **status** (Enum): `paid`, `pending`, `refunded`.
- **paymentMethod** (Enum): `creditCard`, `debitCard`, `cash`, `payAtHotel`.
- **issuedAt** (Timestamp).
- **paidAt** (Timestamp, Nullable).

## 6. MaintenanceLogs Table
Tracks room maintenance issues and repairs.
- **id** (Primary Key).
- **roomId** (Foreign Key -> Rooms).
- **issueDescription** (String).
- **status** (Enum): `open`, `in-progress`, `resolved`.
- **reportedAt** / **resolvedAt** (Timestamps).
