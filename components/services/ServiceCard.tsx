import React from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
};

const ServiceCard = ({ icon, label, active = false, onClick }: Props) => {
  return (
    <div
      className={`py-6 border-2 rounded-2xl flex justify-center items-center flex-col gap-3 cursor-pointer transition-colors ${
        active
          ? "bg-(--primary-soft) border-(--primary) text-(--primary)!"
          : "bg-(--bg-muted) border-(--border-default)"
      }`}
      onClick={onClick}
    >
      {icon}
      <h3 className="font-light! text-center">{label}</h3>
    </div>
  );
};

export default ServiceCard;