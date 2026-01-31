export type SingleBale = {
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
  endIn: string;
  status: "OPEN" | "CLOSED";
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
  createdAt: string;
  updatedAt: string;
  images: string[];
  productSizes: ProductSize[];
  variants: any[]; // update later if variants are added
  supplier: Supplier;
  subCategory: SubCategory;
};

export type ProductSize = {
  id: number;
  sizeId: number;
  productId: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  size: Size;
};

export type Size = {
  id: number;
  label: string;
  formart: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tagId: number | null;
};

export type Supplier = {
  id: number;
  name: string;
  userName: string;
  marketId: number;
  image: string;
  profile: string;
  location: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  supplierId: number | null;
  categories: any[];
};

export type SubCategory = {
  id: number;
  name: string;
  categoryId: number;
  subCategoryslug: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
};

export type Category = {
  id: number;
  name: string;
  categorySlug: string | null;
  priority: number;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};