"use client"

import { AxiosError } from "axios"
import { Button, Card, Input } from "../ui"
import { toast } from "react-toastify"
import { FormEvent, useState } from "react"
import { FormValues, Login } from "@/types/types"
import { useLoginMutation } from "@/api/auth"
import { useAuth } from "@/hooks/use-auth"
import { SingleBale } from "@/types/baletype"
import { useCart } from "@/hooks/use-cart"
import { CartItem, CartItemVariant } from "@/types/checkout"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useBuy } from "@/hooks/use-buy"
import { RiCloseLine } from "react-icons/ri"

type Props = {
  baleData: SingleBale,
  totalAllocatedQuantity: number,
  maxAllowedQuantity: number,
  maxDirectAllowedQuantity: number
  formValues: FormValues,
  selectedVariants: {
    sizes: string[];
    colors: string[];
  },
  items: CartItemVariant[],
  buyDirectly: boolean,
  setNotLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductLogin = ({ baleData, totalAllocatedQuantity, maxAllowedQuantity, maxDirectAllowedQuantity, formValues, selectedVariants, items, buyDirectly, setNotLoggedIn }: Props) => {
  // Login form state
  const [loginValues, setLoginValues] = useState<Login>({
    phone: '',
    password: ''
  });

  // Login endpoint
  const { mutateAsync: loginUser, isPending: isLoginLoading } = useLoginMutation();

  // Authentication
  const { authenticate } = useAuth();

  const { addToCart } = useCart();
  const { addToBuyCart } = useBuy();
  const router = useRouter();

  // Handle login input state
  const handleLoginChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setLoginValues(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Login form submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { phone, password } = loginValues;

    try {
      const data: Login = {
        phone,
        password
      }
      const res = await loginUser(data);
      if (res.status === 200) {
        toast.success(`Login successfully`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const token = res.data?.data?.token;
        const refreshToken = res.data?.data?.refreshToken;
        const user = res.data?.data?.customer;

        authenticate({ user, token, refreshToken });

        if (baleData) {
          if(buyDirectly) {
            if (totalAllocatedQuantity !== maxDirectAllowedQuantity) {
              toast.error(`You must allocate exactly ${maxDirectAllowedQuantity} items.`)
              return
            }
          } else {
            if (totalAllocatedQuantity !== maxAllowedQuantity) {
              toast.error(`You must allocate exactly ${maxAllowedQuantity} items.`)
              return
            }
          }

          if (buyDirectly) {
            addToBuyCart({
              cartItemId: `cart-${baleData.baleId}`,
              productId: baleData.productId,
              baleId: baleData.id,
              name: baleData.product.name,
              image: baleData.product.images[2],
              supplierId: baleData.product.supplierId,
              price: baleData.product.price,
              originalPrice: baleData.product.oldPrice,
              discount: 10,
              currency: "NGN",
              slots: formValues.slots,
              totalSlots: baleData.slot,
              totalShippingFee:
                baleData.deliveryFee * formValues.slots,
              quantity: totalAllocatedQuantity,
              unit: "unit",
              variants: selectedVariants,
              createdAt: baleData.createdAt,
              updatedAt: baleData.updatedAt,
              description: baleData.product.description,
              status: Boolean(baleData.status == "OPEN"),
              endIn: baleData.endIn,
              items,
              inStock: true,
            });
          } else {
            addToCart({
              cartItemId: `cart-${baleData.baleId}`,
              productId: baleData.productId,
              baleId: baleData.id,
              name: baleData.product.name,
              image: baleData.product.images[2],
              supplierId: baleData.product.supplierId,
              price: baleData.product.price,
              originalPrice: baleData.product.oldPrice,
              discount: 10,
              currency: "NGN",
              slots: formValues.slots,
              totalSlots: baleData.slot,
              totalShippingFee:
                baleData.deliveryFee * formValues.slots,
              quantity: totalAllocatedQuantity,
              unit: "unit",
              variants: selectedVariants,
              createdAt: baleData.createdAt,
              updatedAt: baleData.updatedAt,
              description: baleData.product.description,
              status: Boolean(baleData.status == "OPEN"),
              endIn: baleData.endIn,
              items,
              inStock: true,
            });
          }
        }

        if(buyDirectly) {
          router.push('/checkout?direct_order=true');
        } else {
          router.push('/checkout')
        }
      } else {
        toast.success(`Something went wrong`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.success(
        err.response?.data?.message ??
        err.message ??
        "Something went wrong, please try again", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className='w-full md:w-150 md:p-12!'>
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between mb-4">
            <div className="my-4">
              <h1 className="text-3xl">Login</h1>
              <p className="text-(--text-muted)">Enter your details to log into your account</p>
            </div>
            <button
              className="text-sm text-gray-500 cursor-pointer"
              onClick={() => setNotLoggedIn(false)}
            >
              <RiCloseLine size={24} className="mt-4" />
            </button>
          </div>
          <Input
            input_type="text"
            element="input"
            placeholder="Enter your phone number"
            tag="Phone Number"
            name="phone"
            value={loginValues.phone || ''}
            handler={handleLoginChange}
            required
          />
          <Input
            input_type="password"
            element="input"
            placeholder="Enter your password"
            tag="Password"
            name="password"
            value={loginValues.password || ''}
            handler={handleLoginChange}
            required
          />
          <div className="flex justify-end relative -top-4">
            <Link href={''} className='text-(--primary) font-semibold text-sm'>
              Forgot Password?
            </Link>
          </div>
          <Button
            type='submit'
            isFullWidth
            primary
            isLoading={isLoginLoading}
          >
            {isLoginLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-center text-sm mt-3">
          Don't have an account? Click
          <Link href={'/account/register'} className='text-(--primary) font-semibold'> Here </Link>
          to register
        </p>
      </Card>
    </div>
  )
}

export default ProductLogin