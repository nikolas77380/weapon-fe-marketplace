// Base Strapi API client for public requests (without JWT)
export const strapiFetch = async ({
  path,
  method,
  body,
}: {
  path: string;
  method: string;
  body?: any;
}) => {
  const url = `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  }${path}`;

  console.log(`Making ${method} request to:`, url);
  console.log("Request body:", body);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Response error:", errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log("Response data:", data);
  return data;
};

// Protected Strapi API client for authenticated requests (with JWT)
export const strapiFetchAuth = async ({
  path,
  method,
  body,
  token,
}: {
  path: string;
  method: string;
  body?: any;
  token: string;
}) => {
  const url = `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
  }${path}`;

  console.log(`Making authenticated ${method} request to:`, url);
  console.log("Request body:", body);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Response error:", errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log("Response data:", data);
  return data;
};

// Function to create seller meta data
export const createSellerMeta = async ({
  data,
  token,
}: {
  data: {
    specialisation: string;
    sellerDescription: string;
    companyName: string;
    webSite: string;
    phoneNumbers: string;
    country: string;
    address: string;
  };
  token: string;
}) => {
  return strapiFetchAuth({
    path: "/api/seller-metas",
    method: "POST",
    body: {
      data,
    },
    token,
  });
};

// Function to update seller meta data
export const updateSellerMeta = async ({
  id,
  data,
  token,
}: {
  id: number;
  data: {
    specialisation?: string;
    sellerDescription?: string;
    companyName?: string;
    webSite?: string;
    phoneNumbers?: string;
    country?: string;
    address?: string;
  };
  token: string;
}) => {
  return strapiFetchAuth({
    path: `/api/seller-metas/${id}`,
    method: "PUT",
    body: {
      data,
    },
    token,
  });
};
