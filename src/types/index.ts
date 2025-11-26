/**
 * Represents a registered user in the system.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  frame?: Frame;
  handle: string;
  isAdmin?: boolean;
  handleChangedAt?: string; // ISO date string
  nameChangedAt?: string; // ISO date string
  preferences?: {
    emailNotifications: boolean;
  };
}

/**
 * Represents a Secret Santa group.
 */
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

/**
 * Represents a participant in a group.
 * Can be a registered user or a guest invited by email.
 */
export interface Participant {
  id: string;
  userId?: string; // Link to User if registered
  name: string;
  email?: string;
  handle?: string;
  avatar?: string;
  frame?: Frame;
  wishlist: WishlistItem[];
  giftIdeas?: GiftIdeas;
  assignedToId?: string; // The person they drew
}

/**
 * Represents an item in a user's wishlist.
 */
export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  link?: string;
}

/**
 * Represents gift preferences and ideas for a participant.
 */
export interface GiftIdeas {
  gender?: "male" | "female" | "other" | "prefer_not_say";
  ageRange?: string;
  likesSports?: boolean;
  sports?: string;
  style?: string;
  interests: string[];
  maxPrice?: number;
}

/**
 * Represents a decorative frame for a user's avatar.
 */
export interface Frame {
  id: string;
  name: string;
  class: string;
  previewClass?: string;
  image?: string;
}
