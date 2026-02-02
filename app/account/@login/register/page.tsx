"use client"

import { useRegisterMutation } from '@/api/auth'
import { useRouter } from "next/navigation";
import { Button, Card, Input } from '@/components/ui'
import { Login, RegisterPayload } from '@/types/types'
import { AxiosError } from 'axios'
import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import { toast } from 'react-toastify';

const AccountRegister = () => {
  const [formValues, setFormValues] = useState<RegisterPayload>({
    email: '',
    owner: '',
    name: '',
    address: '',
    password: '',
    phone: ''
  });

  const { mutateAsync: registerUser, isPending: isRegisterLoading } = useRegisterMutation();
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

    const { email, phone, owner, name, address, password } = formValues;

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error(`Invalid email`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Phone number validation (only digits, min 7, max 15 digits)
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
      toast.error(`Invalid phone number`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const data: RegisterPayload = {
        email,
        owner,
        name,
        address,
        phone,
        password,
        source: 'b2b'
      };

      const res = await registerUser(data);

      if (res.status === 200) {
        toast.success(`Registration successful`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormValues({
          email: '',
          owner: '',
          name: '',
          address: '',
          password: '',
          phone: ''
        });
        router.push("/account");
      } else {
        toast.warning(`Something went wrong`, {
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
      toast.error(
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
  };

  return (
    <div className='py-20 flex flex-col justify-center items-center'>
      <Card className='w-full md:w-150 md:p-12!'>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <h1 className="text-3xl">Register</h1>
            <p className="text-(--text-muted)">Register to use 440</p>
          </div>
          <Input 
            input_type="email"
            element="input"
            placeholder="Enter your email address"
            tag="Email Address"
            name="email"
            value={formValues.email}
            handler={handleChange}
            required
          />
          <Input 
            input_type="text"
            element="input"
            placeholder="Enter your full name"
            tag="Business Name"
            name="name"
            value={formValues.name}
            handler={handleChange}
            required
          />
          <Input 
            input_type="text"
            element="input"
            placeholder="Enter owner"
            tag="Owner"
            name="owner"
            value={formValues.owner}
            handler={handleChange}
            required
          />
          <Input 
            input_type="text"
            element="input"
            placeholder="Enter your address"
            tag="Address"
            name="address"
            value={formValues.address}
            handler={handleChange}
            required
          />
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
          <Button 
            type='submit'
            isFullWidth 
            primary
            isLoading={isRegisterLoading}
          >
            {isRegisterLoading ? "Registering..." : "Register"}
          </Button>
        </form>
        <p className="text-center text-sm mt-3">
          Already have an account? Click 
          <Link href={'/account'} className='text-(--primary) font-semibold'> Here </Link> 
          to login
        </p>
      </Card>
    </div>
  )
}

export default AccountRegister
