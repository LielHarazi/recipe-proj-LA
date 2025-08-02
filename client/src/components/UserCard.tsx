import type { User } from "@/types";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      "Head Chef": "bg-purple-100 text-purple-800",
      "Sous Chef": "bg-blue-100 text-blue-800",
      "Pastry Chef": "bg-pink-100 text-pink-800",
      "Italian Cuisine Expert": "bg-green-100 text-green-800",
      "Vegan Specialist": "bg-emerald-100 text-emerald-800",
      "Dessert Master": "bg-yellow-100 text-yellow-800",
      Chef: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full bg-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=random`;
          }}
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            {getRoleBadge(user.role || "user")}
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <span>
          Joined {formatDate(user.joinDate || new Date().toISOString())}
        </span>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className="text-xs">{user.email}</span>
        </div>
      </div>
    </div>
  );
}
