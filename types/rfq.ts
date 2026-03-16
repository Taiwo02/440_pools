export type RfqProduct = {
  name: string;
  description: string;
  quantity: string;
  images: (File | string)[];
  previeImages: string[];
};

export type RfqCustomerInfo = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type RfqPayload = {
  customer: RfqCustomerInfo;
  products: RfqProduct[];
};

export type NigerianStateOption = {
  value: string;
  text: string;
};
