import axios from "axios";
import http from "@/lib/http";
import type { RfqPayload } from "@/types/rfq";

const UPLOAD_IMAGE_URL = "https://ccdn.creditclan.com/index.php/mobi/api/uploadImage";

const NIGERIAN_STATES = [
  { value: "Lagos", text: "Lagos" },
  { value: "Abuja", text: "Abuja (FCT)" },
  { value: "Kano", text: "Kano" },
  { value: "Rivers", text: "Rivers" },
  { value: "Oyo", text: "Oyo" },
  { value: "Delta", text: "Delta" },
  { value: "Kaduna", text: "Kaduna" },
  { value: "Ogun", text: "Ogun" },
  { value: "Anambra", text: "Anambra" },
  { value: "Enugu", text: "Enugu" },
  { value: "Abia", text: "Abia" },
  { value: "Adamawa", text: "Adamawa" },
  { value: "Akwa Ibom", text: "Akwa Ibom" },
  { value: "Bauchi", text: "Bauchi" },
  { value: "Bayelsa", text: "Bayelsa" },
  { value: "Benue", text: "Benue" },
  { value: "Borno", text: "Borno" },
  { value: "Cross River", text: "Cross River" },
  { value: "Ebonyi", text: "Ebonyi" },
  { value: "Edo", text: "Edo" },
  { value: "Ekiti", text: "Ekiti" },
  { value: "Gombe", text: "Gombe" },
  { value: "Imo", text: "Imo" },
  { value: "Jigawa", text: "Jigawa" },
  { value: "Katsina", text: "Katsina" },
  { value: "Kebbi", text: "Kebbi" },
  { value: "Kogi", text: "Kogi" },
  { value: "Kwara", text: "Kwara" },
  { value: "Nasarawa", text: "Nasarawa" },
  { value: "Niger", text: "Niger" },
  { value: "Osun", text: "Osun" },
  { value: "Plateau", text: "Plateau" },
  { value: "Sokoto", text: "Sokoto" },
  { value: "Taraba", text: "Taraba" },
  { value: "Yobe", text: "Yobe" },
  { value: "Zamfara", text: "Zamfara" },
] as const;

export { NIGERIAN_STATES };

export async function uploadImage(formData: FormData): Promise<{ filename?: string }> {
  const { data } = await axios.post<{ filename?: string }>(UPLOAD_IMAGE_URL, formData);
  return data;
}

export async function uploadRfq(payload: RfqPayload): Promise<unknown> {
  const { data } = await http.post("/partener/save_quotation", payload);
  return data;
}
