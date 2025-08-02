import type { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      announcement: "bg-orange-100 text-orange-800",
      product: "bg-green-100 text-green-800",
      sale: "bg-red-100 text-red-800",
      review: "bg-purple-100 text-purple-800",
      tips: "bg-yellow-100 text-yellow-800",
      deal: "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${
        post.featured ? "border-l-4 border-orange-500" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full bg-gray-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.author.name
              )}&background=random`;
            }}
          />
          <div>
            <h3 className="font-semibold text-orange-600">
              {post.author.name}
            </h3>
            <p className="text-sm text-gray-500">{post.author.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getCategoryBadge(post.category)}
          {post.featured && (
            <span className="text-yellow-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-orange-600 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{formatDate(post.timestamp)}</span>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
