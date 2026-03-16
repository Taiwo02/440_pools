# Request for Quotation (RFQ) – Flow & API Reference

Use this doc in the **backend** (or any other project) to implement or integrate with the same RFQ flow as the 440_pools frontend.

---

## User flow (frontend)

1. **Step 1 – Products**  
   User adds one or more products:
   - Product name (required)
   - Description
   - Quantity
   - Up to 3 images per product (uploaded immediately via `POST /upload/image`)
   - “Add to Cart” adds the product to the list; “Next” goes to Step 2.

2. **Step 2 – Summary**  
   User reviews the list, can edit or delete items, “Add More” (back to Step 1), or “Next” to Step 3.

3. **Step 3 – Customer info**  
   User fills:
   - Full name (required)
   - Phone (required)
   - Email (required)
   - State (required) – Nigerian state from a fixed list.
   - “Submit Request” sends the payload to `POST /rfq`.

---

## API contracts

### 1. Image upload (per image, before submit)

- **Method:** `POST`
- **Path:** `/upload/image` (or whatever the backend exposes; frontend uses this path relative to `baseURL`).
- **Request:** `multipart/form-data` with one file field named `file`.
- **Response:** JSON with at least:
  - `filename` (string) – identifier/path to use in the RFQ payload.

Example response: `{ "filename": "abc123.jpg" }`

---

### 2. Submit RFQ

- **Method:** `POST`
- **Path:** `/rfq`
- **Request body:** JSON (see below).

#### Payload shape

```ts
{
  "customer": {
    "name": string,      // full name
    "phone": string,
    "email": string,
    "address": string    // Nigerian state (e.g. "Lagos", "Abuja", "Kano")
  },
  "products": [
    {
      "name": string,
      "description": string,
      "quantity": string,
      "images": string[]   // array of filenames returned from POST /upload/image
    }
  ]
}
```

- `customer.address` is the **state** (one of the Nigerian states below).
- `products[].images` are **filenames** only (strings). The frontend uploads images first and sends these identifiers in the RFQ payload.  
- `previeImages` is client-side only (preview URLs) and is **not** sent to the backend.

---

## Nigerian states (for address/state dropdown)

Backend can use this list for validation or for building the same dropdown. The frontend sends the **value** (e.g. `"Lagos"`) in `customer.address`.

| value        | text          |
|-------------|---------------|
| Lagos       | Lagos         |
| Abuja       | Abuja (FCT)   |
| Kano        | Kano          |
| Rivers      | Rivers        |
| Oyo         | Oyo           |
| Delta       | Delta         |
| Kaduna      | Kaduna        |
| Ogun        | Ogun          |
| Anambra     | Anambra       |
| Enugu       | Enugu         |
| Abia        | Abia          |
| Adamawa     | Adamawa       |
| Akwa Ibom   | Akwa Ibom     |
| Bauchi      | Bauchi        |
| Bayelsa     | Bayelsa       |
| Benue       | Benue         |
| Borno       | Borno         |
| Cross River | Cross River   |
| Ebonyi      | Ebonyi        |
| Edo         | Edo           |
| Ekiti       | Ekiti         |
| Gombe       | Gombe         |
| Imo         | Imo           |
| Jigawa      | Jigawa        |
| Katsina     | Katsina       |
| Kebbi       | Kebbi         |
| Kogi        | Kogi          |
| Kwara       | Kwara         |
| Nasarawa    | Nasarawa      |
| Niger       | Niger         |
| Osun        | Osun          |
| Plateau     | Plateau       |
| Sokoto      | Sokoto        |
| Taraba      | Taraba        |
| Yobe        | Yobe          |
| Zamfara     | Zamfara       |

---

## TypeScript types (for backend reference)

```ts
type RfqCustomerInfo = {
  name: string;
  phone: string;
  email: string;
  address: string; // state
};

type RfqProductPayload = {
  name: string;
  description: string;
  quantity: string;
  images: string[]; // filenames from upload
};

type RfqPayload = {
  customer: RfqCustomerInfo;
  products: RfqProductPayload[];
};
```

---

## Frontend entry points

- **UI:** Modal opened by the “Request For Quotation” button on the home header.
- **Form:** `components/requestForQuot/RequestQuoteForm.tsx`
- **API layer:** `api/rfq.ts` (`uploadImage`, `uploadRfq`, `NIGERIAN_STATES`)
- **Types:** `types/rfq.ts`

Copy or link to this file from your backend repo so the same flow and payload are used when implementing or testing the RFQ API.
