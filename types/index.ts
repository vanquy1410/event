import { Document } from 'mongoose';

export interface IEvent {
  seats: any;
  _id: string;
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  imageUrl: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  url: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    _id: string;
    name: string;
  };
  participantLimit: number;
  currentParticipants: number;
}

export interface IOrder extends Document {
  buyerName: string;
  selectedSeat: number;
  seatType: {
    id: string;
    name: string;
    description: string;
  };
  _id: string;
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: IEvent;
  buyer: string;
  seats?: boolean[];
}

// Thêm type Order
export type Order = {
  _id: string;
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: IEvent; // Sự kiện liên quan đến đơn hàng
  buyer: string; // ID của người mua
  selectedSeat: number; // Ghế đã chọn
  seats?: boolean[]; // Danh sách ghế
};

// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserParams = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string
  event: {
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
    participantLimit: number // Add this line
    eventOrganizerId: string // Add this line
  }
  path: string
}

export type UpdateEventParams = {
  userId: string
  event: {
    _id: string
    title?: string
    description?: string
    location?: string
    imageUrl?: string
    startDateTime?: Date
    endDateTime?: Date
    categoryId?: string
    price?: string
    isFree?: boolean
    url?: string
    participantLimit?: number // Add this line
    currentParticipants?: number  // Add this line
    seats?: boolean[]  // Make sure this is also included
    eventOrganizerId?: string // Add this line
  }
  path: string
}

export type DeleteEventParams = {
  eventId: string
  path: string
}

export type GetAllEventsParams = {
  query?: string;
  category?: string;
  limit?: number;
  page?: number;
};

export type GetEventsByUserParams = {
  userId: string
  limit?: number
  page: number
}

export type GetRelatedEventsByCategoryParams = {
  categoryId: string
  eventId: string
  limit?: number
  page: number | string
}

export type Event = {
  _id: string
  title: string
  description: string
  price: string
  isFree: boolean
  imageUrl: string
  location: string
  startDateTime: Date
  endDateTime: Date
  url: string
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
  category: {
    _id: string
    name: string
  }
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string
}

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string
  eventId: string
  price: string
  isFree: boolean
  buyerId: string
  selectedSeat: any;
}

export type CreateOrderParams = {
  eventId: string;
  buyerId: string;
  eventTitle: string;
  price: string;
  isFree: boolean;
  selectedSeat: number;
  seatType: string;
}

export type GetOrdersByEventParams = {
  eventId: string
  searchString: string
}

export type GetOrdersByUserParams = {
  userId: string | null
  limit?: number
  page: string | number | null
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string
  key: string
  value: string | null
}

export type RemoveUrlQueryParams = {
  params: string
  keysToRemove: string[]
}

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

type Organizer = {
  // ... other properties
  status: "pending" | "approved" | "rejected" | "cancelled";
};

export interface Blog {
  _id: string
  title: string
  description: string
  content: string
  imageUrl: string
  createdAt: string
  tags: string[]
}

export interface BlogFormData {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string[];
}

interface CancelTicketNotification {
  _id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  eventTitle: string;
  ticketPrice: number;
  cancelDate: Date;
  message: string;
}

export type OrderData = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
  selectedSeat: number;
};

export interface IOrderItem {
  _id: string;
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    seats: boolean[];
    currentParticipants: number;
    url: string;
  };
  buyer: string;
  buyerName: string;
  eventTitle: string;
  selectedSeat: number;
  seatType: {
    id: string;
    name: string;
    description: string;
  };
}

