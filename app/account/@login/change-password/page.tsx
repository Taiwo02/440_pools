"use client"

import { useChangePassword } from "@/api/auth";
import { Button, Card, Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { getCrossSubdomainCookie } from "@/lib/utils";
import { FormEvent, useState } from "react";

type Props = {}

type Values = {
  token: string,
  newPassword: string,
  confirmPassword: string
}

const defaultValues: Values = {
  token: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePassword = (props: Props) => {
  const [formValues, setFormValues] = useState<Values>(defaultValues);
  const { mutateAsync: changePassword, isPending: isChangePending, error: changeError } = useChangePassword();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {

  }
  return (
    <div className="h-screen flex flex-col justify-center items-center px-6">
      <Card className="w-full md:w-150 md:p-12!">
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <h1 className="text-3xl">Reset Password</h1>
            <p className="text-(--text-muted)">
              Token has been sent to { getCrossSubdomainCookie('reset_phone') }
            </p>
          </div>
          <Input
            input_type="text"
            element="input"
            placeholder="Enter your token"
            tag="Token"
            name="token"
            value={formValues.token}
            handler={handleChange}
            required
          />
          <Input
            input_type="password"
            element="input"
            placeholder="Enter new password"
            tag="New Password"
            name="newPassword"
            value={formValues.newPassword}
            handler={handleChange}
            required
          />
          <Input
            input_type="password"
            element="input"
            placeholder="Confirm password"
            tag="Confirm Password"
            name="confirmPassword"
            value={formValues.confirmPassword}
            handler={handleChange}
            required
          />
          <Button type="submit" isFullWidth primary isLoading={isChangePending}>
            {isChangePending ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ChangePassword