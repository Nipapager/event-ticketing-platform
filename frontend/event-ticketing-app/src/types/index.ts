// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  profileUrl?: string;
  address?: string;
  isActive: boolean;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  roles: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

// Event related types
export interface Event {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  venueId: number;
  venueName: string;
  venueAddress?: string;
  venueCity?: string;
  venueCapacity?: number;
  venueLatitude?: number;
  venueLongitude?: number;
  eventDate: string;
  eventTime: string;
  imageUrl?: string;
  organizerId: number;
  organizerName: string;
  status: string;
  ticketTypes?: TicketType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketType {
  id: number;
  eventId: number;
  eventName: string;
  name: string;
  price: number;
  totalQuantity: number;
  quantityAvailable: number;
  createdAt?: string;
  updatedAt?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Venue types
export interface Venue {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  description?: string;
  imageUrl?: string;
  mapCoordinates?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Order related types
export interface Order {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  orderItems: OrderItem[];
  orderDate: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  eventId: number;
  eventName: string;
  ticketTypeName: string;
  quantity: number;
  pricePerTicket: number;
  qrCodeUrl?: string;
  ticketCode?: string;
  isValid?: boolean;
  createdAt: string;
}

export interface OrderRequest {
  eventId: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  ticketTypeId: number;
  quantity: number;
}

// Review types
export interface Review {
  id: number;
  userId: number;
  userName: string;
  eventId: number;
  eventName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CheckoutRequest {
  eventId: number;
  items: {
    ticketTypeId: number;
    quantity: number;
  }[];
}

export interface CheckoutResponse {
  sessionId: string;
  sessionUrl: string;
  orderId: number;
}