"use client"
import { AxiosError } from "axios";
import { Button, Card, Input } from "../ui";
import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { FormValues } from "@/types/types";
import { SingleBale } from "@/types/baletype";
import { setStoredName, setStoredPhone } from "@/lib/utils";

type Props = {
  setIsPhoneNotRegistered: React.Dispatch<React.SetStateAction<boolean>>;
  onPhoneSaved: () => void;
};

const PhoneNumber = ({
  setIsPhoneNotRegistered,
  onPhoneSaved
}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (phoneNumber.trim() !== "") {
      setStoredPhone(phoneNumber.trim());
      setStoredName(name.trim());
      setIsPhoneNotRegistered(false);
      toast.success("Phone number saved successfully!");
      onPhoneSaved(); // <- resumes the add-to-cart flow
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center">
      <Card className="w-full md:w-150 md:p-12!">
        <form onSubmit={handleSubmit}>
          <div className="flex items-start justify-between mb-4">
            <div className="my-4">
              <h1 className="text-3xl">Phone Number</h1>
              <p className="text-(--text-muted)">
                Enter your phone number to add items to the cart
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-gray-500 cursor-pointer"
              onClick={() => setIsPhoneNotRegistered(false)}
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
            value={phoneNumber}
            handler={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Input
            input_type="text"
            element="input"
            placeholder="Enter your name"
            tag="Name"
            name="name"
            value={name}
            handler={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" isFullWidth primary>
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default PhoneNumber