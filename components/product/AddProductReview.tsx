"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Input } from "../ui";
import { useCreateReview } from "@/api/review";
import { ReviewPayload } from "@/types/types";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type Props = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  productId: number;
};

const AddProductReview = ({ isOpen, setModalOpen, productId }: Props) => {
  if (!isOpen) return null;
  if (typeof document === "undefined") return null;
  const buyer = JSON.parse(localStorage.getItem("merchant")!);
  const buyerId = Number(buyer?.id);

  const { mutateAsync: createReview, isPending: isCreatePending, error: createError } = useCreateReview();

  const [formValues, setFormValues] = useState({
    rating: 1,
    note: ''
  });

  useEffect(() => {
    console.log(buyer)
    console.log(buyerId)
  }, [])

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
    e.preventDefault();

    const payload: ReviewPayload = {
      buyerId,
      productId,
      rating: formValues.rating,
      note: formValues.note
    };

    if(!buyerId) {
      toast.error(`Please log in to add a review`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      try {
        const res = await createReview(payload);

        if(res.status == 200 || res.status == 201) {
          toast.success(`Review added`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setFormValues({
            rating: 1,
            note: ""
          });
          setModalOpen(false);
        } else {
          toast.error(`Something went wrong`, {
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
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex min-h-dvh w-full items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => setModalOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="">
            <h2 className="text-xl font-bold">Add a Review</h2>
            <p className="text-(--text-muted)">Add a review for this product</p>
          </div>
          <Input
            element="select"
            placeholder="Choose your rating"
            tag="Rating"
            name="rating"
            value={formValues.rating}
            handler={handleChange}
            selectOptions={["1", "2", "3", "4", "5"]}
            required
          />
          <Input
            element="textarea"
            placeholder="Your review"
            tag="Review"
            name="note"
            value={formValues.note}
            handler={handleChange}
            required
          />
          <Button primary disabled={isCreatePending}>
            {isCreatePending ? "Adding Review" : "Add Review"}
          </Button>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default AddProductReview;