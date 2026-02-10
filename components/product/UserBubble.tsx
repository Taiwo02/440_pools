import { RiUserFill } from "react-icons/ri";

type Props = {
  count: number;
};

const MAX_VISIBLE = 3;

const UserBubbles = ({ count }: Props) => {
  const visibleCount = Math.min(count, MAX_VISIBLE);
  const remaining = count - MAX_VISIBLE;

  return (
    <div className="flex items-center">
      {Array.from({ length: visibleCount }).map((_, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs border-2 border-white -ml-4 first:ml-0"
        >
          <RiUserFill size={14} />
        </div>
      ))}

      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-xs font-medium border-2 border-white -ml-4">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default UserBubbles;