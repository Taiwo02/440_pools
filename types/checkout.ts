export type CheckoutPayload = {
  totalAmount: number;
  primaryAmount: number;
  totalShippingFee: number;
  deliveryAddressId: number;
  totalQuantity: number;
  bales: CheckoutBale[];
};

export type CheckoutBale = {
  quantity: number;
  price: number;
  totalPrice: number;
  bale: Bale;
  items: BaleItem[];
};

export type Bale = {
  id: number;
  productId: number;
  quantity: number;
  filled: number;
  slot: number;
  filledSlot: number;
  price: number;
  oldPrice: number;
  totalDeliveryFee: number;
  deliveryFee: number;
  baleId: string;
  endIn: string; // ISO date
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  product: Product;
};

export type Product = {
  id: number;
  supplierId: number;
  subCategoryId: number;
  price: number;
  oldPrice: number;
  name: string;
  description: string;
  status: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type BaleItem = {
  size: ProductSize;
  color: ProductColor;
  quantity: number;
  totalPrice: number;
};

export type ProductSize = {
  id: number;
  label: string;
  formart: string; // keeping backend typo for compatibility
  type: "shoe" | "clothing";
};

export type ProductColor = {
  id: number;
  productId: number;
  color: string;
  otherColor: string;
  images: string[];
  status: boolean;
};