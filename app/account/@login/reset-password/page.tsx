"use client";
import { useResetPassword } from '@/api/auth';
import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { setCrossSubdomainCookie } from '@/lib/utils';
import { AxiosError } from 'axios';
import React, { FormEvent, useState } from 'react'
import { toast } from 'react-toastify';

type Props = {}

const ResetPassword = (props: Props) => {
  const [phone, setPhone] = useState("");
  const { mutateAsync: resetPassword, isPending: isResetPending, error: resetError } = useResetPassword();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formattedNumber = "+234" + phone.slice(1);
      console.log(formattedNumber);
      const res = await resetPassword(formattedNumber);

      if(res.status == 200 || res.status == 201) {
        toast.success(`Token Sent to ${phone}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setCrossSubdomainCookie("reset_phone", formattedNumber, 1);
        // setTimeout(() => window.location.href = '/account/change-password', 4000);
      } else {
        toast.error(`Something went wrong: ${res.data.message}`, {
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
          "Something went wrong, please try again",
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center px-6">
      <Card className="w-full md:w-150 md:p-12!">
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <h1 className="text-3xl">Reset Password</h1>
            <p className="text-(--text-muted)">
              A token will be sent to your phone number
            </p>
          </div>
          <Input
            input_type="text"
            element="input"
            placeholder="Enter your phone number"
            tag="Phone Number"
            name="phone"
            value={phone || ""}
            handler={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" isFullWidth primary isLoading={isResetPending}>
            {isResetPending ? "Sending..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ResetPassword