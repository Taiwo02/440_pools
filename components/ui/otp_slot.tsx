import { OTPInput, SlotProps } from "input-otp";

const OtpSlot = (props: SlotProps) => {
  return (
    <div
      className={`
        relative w-12 h-14 flex items-center justify-center
        text-xl border rounded-md
        ${props.isActive ? "border-(--primary) ring-2 ring-(--primary)/30" : "border-gray-300"}
      `}
    >
      {props.char !== null && (
        <div className="w-3 h-3 rounded-full bg-(--primary)" />
      )}
      {props.hasFakeCaret && (
        <div className="absolute w-px h-6 bg-(--primary) animate-pulse" />
      )}
    </div>
  );
};

export default OtpSlot
