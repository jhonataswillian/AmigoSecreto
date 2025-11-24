export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  handle: string;
  isAdmin?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  eventDate?: string;
  maxPrice: number;
  ownerId: string;
  participants: Participant[];
  status: "created" | "drawn";
}

export interface Participant {
  id: string;
  userId?: string; // Link to User if registered
  name: string;
  email?: string;
  avatar?: string;
  wishlist: WishlistItem[];
  giftIdeas?: GiftIdeas;
  assignedToId?: string; // The person they drew
}

export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  link?: string;
}

export interface GiftIdeas {
  gender?: "male" | "female" | "other" | "prefer_not_say";
  ageRange?: string;
  likesSports?: boolean;
  sports?: string;
  style?: string;
  interests: string[];
  maxPrice?: number;
}
