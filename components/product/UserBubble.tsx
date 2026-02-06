  type User = {
    id: string;
    name: string;
  };

  type Props = {
    users: User[];
    maxVisible?: number;
  };

  const UserBubbles = ({ users, maxVisible = 3 }: Props) => {
    const visibleUsers = users.slice(0, maxVisible);
    const remaining = users.length - maxVisible;

    return (
      <div className="flex items-center">
        {visibleUsers.map((user, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-medium border-2 border-white -ml-3 first:ml-0"
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}

        {remaining > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-sm font-medium border-2 border-white -ml-4">
            +{remaining}
          </div>
        )}
      </div>
    );
  };

  export default UserBubbles