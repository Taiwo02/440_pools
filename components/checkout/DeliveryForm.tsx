"use client"

import { FormEvent, useEffect, useState } from "react";
import { RiMailLine, RiMapPinLine, RiPhoneLine, RiUser3Line } from "react-icons/ri";
import { Button } from "../ui";
import { useDeliveryMutation } from "@/api/order";
import { toast } from "react-toastify";

type Props = {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type Merchant = {
  id: string;
  phone: string;
  email: string;
};

const DeliveryForm = ({ setIsModalOpen }: Props) => {
  const [user, setUser] = useState<Merchant | null>(null);
  const { mutateAsync: postDelivery, isPending: isDeliveryLoading } = useDeliveryMutation();

  useEffect(() => {
    const merchantString = localStorage.getItem("merchant");
    if (merchantString) {
      setUser(JSON.parse(merchantString));
    }
    console.log(user);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    LastName: '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    countryCode: '+234',
    additionalPhone: '',
    additionalCountryCode: '+234',
    address: '',
    additionalInfo: '',
    city: '',
    state: '',
    region: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const deliveryData = {
      firstName: formData.firstName,
      LastName: formData.LastName,
      countryCode: formData.countryCode,
      phone: formData.phone,
      additionalCountryCode: formData.additionalCountryCode,
      additionalPhone: formData.additionalPhone,
      address: formData.address,
      additionalInfo: formData.additionalInfo,
      region: formData.region,
      city: formData.city,
      state: formData.state,
      setDefault: false,
      merchantId: Number(user?.id)
    }

    const res = await postDelivery(deliveryData);

    if (res.status == 200 || res.status == 201) {
      toast.success("Address added successfully");
      setIsModalOpen(false);
    } else {
      toast.error("Something went wrong");
      return;
    }
  }

  return (
    <div className="space-y-6 overflow-auto">

      <div className="">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-medium text-gray-900">
            Shipping Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <RiUser3Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="+234">+234</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <div className="relative flex-1">
                  <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="8102637956"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Additional Phone (Optional)
              </label>
              <div className="relative flex gap-2">
                <select
                  name="additionalCountryCode"
                  value={formData.additionalCountryCode}
                  onChange={handleInputChange}
                  className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="+234">+234</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <div className="relative flex-1">
                  <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="additionalPhone"
                    value={formData.additionalPhone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="9063786452"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <RiMapPinLine className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="123 Main Street, Apartment 4B"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <input
              type="text"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Landmark, special instructions, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Lagos"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Lagos"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Gbagada"
              />
            </div>
          </div>

          <Button primary isLoading={isDeliveryLoading}>
            {isDeliveryLoading ? 'Adding Address' : 'Add Address' }
          </Button>
        </form>
      </div>
    </div>
  )
}

export default DeliveryForm