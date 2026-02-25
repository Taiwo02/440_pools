"use client"

import React, { useEffect } from 'react'
import { RiCloseLine } from 'react-icons/ri';
// @ts-ignore
import Modal from "react-modal";

type Props = {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  children?: React.ReactNode
}

const MyModal = ({ isModalOpen, setIsModalOpen, children }: Props) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      contentLabel="Example Modal"
      ariaHideApp={false}
      style={{
        overlay: { 
          backgroundColor: "rgba(0,0,0,0.7)", 
          zIndex: 10000 
        },
        content: { 
          width: window.innerWidth > 768 ? '70%' : '90%',
          left: window.innerWidth > 768 ? '15%' : '5%',
          height: window.innerWidth > 768 ? 'auto' : '90%',
          overflow: 'auto',
          backgroundColor: '#fff',
          borderRadius: '20px',
          border: 'none',
          padding: window.innerWidth > 768 ? 30 : 20
        },
      }}
    >
      <button onClick={() => setIsModalOpen(false)} className='block ml-auto'>
        <RiCloseLine size={20} />
      </button>
      {children}
    </Modal>
  )
}

export default MyModal;