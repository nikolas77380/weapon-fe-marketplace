import { Product } from "./types";
import { getSessionTokenFromCookie } from "./auth";
import { strapiFetchAuth } from "./strapi";

export interface CreateChannelResponse {
  success: boolean;
  order: {
    id: number;
    status: string;
    sendbirdChannelId: string;
    sendbirdChannelUrl: string;
  };
  channel: {
    channelUrl: string;
    name: string;
    channelId: string;
  };
  product: {
    id: number;
    title: string;
    price: number;
  };
  seller: {
    id: number;
    username: string;
    companyName?: string;
  };
}

export async function createSendBirdChannel(product: Product) {
  if (!product.id) {
    throw new Error("Product ID is missing");
  }

  const token = getSessionTokenFromCookie();
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const res = await strapiFetchAuth({
      path: "/api/orders",
      method: "POST",
      body: {
        productId: product.id.toString(),
      },
      token,
    });
    return res as CreateChannelResponse;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
}

export function redirectToMessages(): void {
  // For now, just redirect to messages page
  // The user will see the newly created channel in their channel list
  window.location.href = `/messages`;
}
