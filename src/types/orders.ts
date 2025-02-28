export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  variant?: {
    id: string;
    title: string;
    price: string;
    sku?: string;
  };
}

export interface Order {
  id: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  lineItems: OrderItem[];
}

export interface FirebaseOrder {
  id: string;
  firebaseId: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    variant?: {
      id: string;
      title: string;
      price: string;
      sku?: string;
    };
  }>;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  subtotalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  shippingAddress?: {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  syncedAt: string;
  lastUpdated: string;
  tags?: string[];
  note?: string;
}

export interface RawFirebaseOrder {
  id?: string;
  firebaseId: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  lineItems?: Array<{
    title: string;
    quantity: number;
    variant?: {
      title: string;
      price: string;
    };
  }>;
  totalPriceSet?: {
    shopMoney?: {
      amount?: string;
      currencyCode?: string;
    };
  };
  syncedAt: string;
  lastUpdated: string;
} 