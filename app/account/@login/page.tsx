"use client"

import { useLoginMutation } from '@/api/auth'
import { Button, Card, Input } from '@/components/ui'
import { useAuth } from '@/hooks/use-auth'
import { Login } from '@/types/types'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useEffect, useState } from 'react'
import { toast } from "react-toastify";

const AccountLogin = () => {
  const [formValues, setFormValues] = useState<Login>({
    phone: '',
    password: ''
  });

  useEffect(() => {
    const shouldToast = sessionStorage.getItem("showLoginToast");

    if (shouldToast) {
      toast.warning(`Login to join pool`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      sessionStorage.removeItem("showLoginToast");
    }
  }, []);

  const { mutateAsync: loginUser, isPending: isLoginLoading } = useLoginMutation();
  const { authenticate } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
  const { name, value } = e.target;

  setFormValues(prevData => ({
    ...prevData,
    [name]: value,
  }));
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { phone, password } = formValues;

    try {
      const data: Login = {
        phone,
        password
      }
      const res = await loginUser(data);
      if (res.status === 200) {
        toast.success(`✓ Login successfully`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        const token = res.data?.token;
        const user = res.data;

        authenticate({ user, token });

        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin');
          
          router.replace(redirectUrl);
        } else {
          router.replace("/account");
        }
        
        window.location.reload();
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
    <div className='h-screen flex flex-col justify-center items-center'>
      <Card className='w-full md:w-150 md:p-12!'>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <h1 className="text-3xl">Login</h1>
            <p className="text-(--text-muted)">Enter your details to log into your account</p>
          </div>
          <Input 
            input_type="text"
            element="input"
            placeholder="Enter your phone number"
            tag="Phone Number"
            name="phone"
            value={formValues.phone}
            handler={handleChange}
            required
          />
          <Input 
            input_type="password"
            element="input"
            placeholder="Enter your password"
            tag="Password"
            name="password"
            value={formValues.password}
            handler={handleChange}
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

export default AccountLogin