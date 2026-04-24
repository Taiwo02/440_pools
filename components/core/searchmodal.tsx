import React from 'react'
// @ts-ignore
import Modal from "react-modal";
import { Button, Input } from '../ui';
import { RiCloseLine } from 'react-icons/ri';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const SearchModal = ({isModalOpen, setIsModalOpen, searchTerm, setSearchTerm}: Props) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Search Modal"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.7)",
          zIndex: 100,
        },
        content: {
          width: "90%",
          top: "30%",
          left: "5%",
          height: "40%",
          backgroundColor: "var(--bg-page)",
          borderRadius: "10px",
          border: "none",
        },
      }}
    >
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute block ml-auto shrink-0 right-4 text-(--text-muted)"
      >
        <RiCloseLine size={20} />
      </button>
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-full">
          <h1 className="text-lg mb-.5">Search</h1>
          <p className="text-sm text-(--text-muted)">
            Search products, pools & suppliers
          </p>
        </div>
        <form className="w-full">
          <Input
            input_type="search"
            element="input"
            name="search"
            value={searchTerm}
            handler={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            genStyle="w-full mb-2! flex-1 text-sm bg-transparent border-none outline-none placeholder:text-(--text-muted)"
          />
          <Button primary className="rounded-lg py-2! px-3! text-sm">
            Search
          </Button>
        </form>
      </div>
    </Modal>
  );
}

export default SearchModal