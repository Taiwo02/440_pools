// Toast Types
export type ToastVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export type ToastPlacement = "top-right" | "bottom-right";

export type ToastItem = {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
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
  endIn: string; // ISO date string
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  product: Product;
};

export type Login = {
  phone: string;
  password: string;
}

export type RegisterPayload = {
  email: string;
  owner: string;
  name: string;
  address: string;
  password: string;
  phone: string;
  source?: "b2b";
};

export type CompletionDetails = {
  score: number;
  picture: boolean;
  bank_details: boolean;
  business_details: boolean;
  phone_validated: boolean;
  name: string;
  phone: string;
  business_type: number | null;
  global_catalogue_link: string | null;
};

export type Accounts = {
  id: number;
  merchant_id: number;
  wema: string;
  providus: string;
  kuda: string;
  keep_kuda: string;
  ninepsb: string;
  zenith: string;
  VFD: string;
  gtb: string;
  access: string;
  wema_account: string;
  moniepoint: string;
  sterling: string;
};

export type Loan = {
  id: number;
  agent_id: number | null;
  creditclan_request_id: number | null;
  amount: string;
  duration: number;
  stage: number;
  status: number;
  analysis_completed: any[];
  stages: any | null;
  disbursed: number;
  amount_disbursed: string | null;
  disbursement_date: string | null;
  created_at: string;
  offer: string | null;
  has_offer: number;
  partnership_status: number;
  assigned_staff: number;
  source: any | null;
  se_amount: any | null;
  fees_scenario: any | null;
  called_track: number;
  merchant_type: any | null;
  assessment_id: any | null;
};

export type ProfileData = {
  id: number;
  agent_id: number;
  manager_id: number | null;
  name: string;
  shop_name: string;
  slug: string;
  store_link: string | null;
  registered_with: number;
  email: string;
  email_validated: number;
  phone: string;
  phone_validated: number;
  phone_token: string | null;
  password_reset_link: string | null;
  picture: string | null;
  whatsapp_no: string | null;
  whatsapp_validated: number;
  instagram_phone: string | null;
  instagram_phone_validated: number;
  whatsapp_link: string | null;
  whatsapp_buy_link: string | null;
  facebook: string | null;
  instagram: boolean;
  twitter: string | null;
  jumia: boolean;
  jiji: boolean;
  konga: boolean;
  whatsapp_code: string | null;
  address: string;
  state: number;
  country_id: number | null;
  business_type: number | null;
  bank_code: number | null;
  bank_id: number | null;
  account_name: string;
  account_number: string;
  generated_account_number: string;
  verified: number;
  interests: any;
  uses_global: number;
  popular_products_activated: number;
  global_catalogue_link: string | null;
  added_global_items: any;
  partnership_email_token: string | null;
  partnership: number;
  upfront_rate: any;
  monthly_interest_rate: any;
  max_credit_duration: any;
  interest_on_total: number;
  interest_on_balance: number;
  orders_notify: number;
  repayments_notify: number;
  banner_image: string | null;
  banner_title: string | null;
  banner_subtitle: string | null;
  sections: any;
  items_display: any;
  theme_color: string;
  template: number;
  filter_position: any;
  details_template: any;
  collection_banner: boolean;
  publisher: number;
  show_product_comments: boolean;
  show_product_ratings: boolean;
  online: number;
  other_platforms: any;
  store_photo: string;
  internal: number;
  email_change_otp: any;
  phone_change_otp: any;
  eligibility: number;
  collection: number;
  insurance: number;
  widget: number;
  whatsapp_stage: any;
  bot_name: any;
  top_category_one: any;
  top_category_three: any;
  sender_id: any;
  temporary_bot: any;
  location: string;
  id_card: string;
  description: string | null;
  is_approved: number;
  step: number;
  code: string | null;
  WANT_UPFRONT: number;
  SLA_SIGNED: number;
  sla_link: string | null;
  OWNER: any;
  sla: any;
  deleted: number;
  created_at: string;
  telemarketer: any;
  feedback_provided: number;
  feedback_type: any;
  feedback_comments: any;
  feedback_date: any;
  opinion: any;
  token: string | null;
  valid_token: number;
  kyc: number;
  kyc_form: number;
  kyc_request_id: any;
  credit_limit: any;
  social_credit_limit: string;
  credit_limit_expiry_date: any;
  daily_sales: any;
  business_model: any;
  employees: any;
  credit_amount: any;
  has_offer: number;
  offer: any;
  instagram_connected: number;
  jiji_connected: number;
  jumia_connected: number;
  konga_connected: number;
  account_credit_limit: any;
  social_credit_position: any;
  address_verified: number;
  source: number;
  reseller: number;
  million_credit: number;
  categories: any;
  sub_categories: any;
  assigned_telemarketer: number;
  providus: string;
  majorLandmark: any;
  lga: any;
  title: any;
  withdrawal_token: any;
  last_sms_sent: string;
  account_tier: number;
  is_staff: number;
  store_video: any;
  CAC: any;
  added_bvn: number;
  market_name: string;
  wholesale: number;
  app_version: string;
  user_type: string;
  home_address: string;
  market: any;
  is_support: number;
  is_440: number;
  last_login: string;
  gift_balance: string;
  download_status: number;
  has_won: number;
  win_date: string;
  flag: number;
  utility_bill: any;
  dob: string;
  nin_slip: string;
  approved_profile: number;
  approved_id: number;
  approved_nin_slip: number;
  approved_utility_bill: number;
  approved_store: number;
  approved_cac: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  banner_slides: any[];
  accounts: Accounts;
  loan: Loan;
  jumia_username: string | null;
  konga_username: string | null;
  jiji_username: string | null;
  instagram_username: string | null;
  Amazon: boolean;
  Amazon_username: string | null;
  Olist: boolean;
  Olist_username: string | null;
  Ebay: boolean;
  Ebay_username: string | null;
  loan_status: boolean;
  play_today: boolean;
  completion_details: CompletionDetails;
};

export type ProfileResponse = {
  data: ProfileData;
  status: boolean;
};
