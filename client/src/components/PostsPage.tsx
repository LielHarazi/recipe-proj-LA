import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { ReviewCard } from "@/components/ReviewCard";
import { UserCard } from "@/components/UserCard";
import { CreatePostForm } from "@/components/CreatePostForm";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";

export function PostsPage() {
  const { postsData, isLoading, error, refetch } = usePosts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">
            Error Loading Content
          </h2>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!postsData || !postsData.posts) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const categories = [
    "all",
    ...Array.from(new Set(postsData.posts.map((post) => post.category))),
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? postsData.posts
      : postsData.posts.filter((post) => post.category === selectedCategory);

  const featuredPosts = postsData.posts.filter((post) => post.featured);

  return (
    <div className="min-h-[calc(100vh-80px)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600">
            Recipe Community & Chef Reviews
          </h1>
          <p className="text-xl text-orange-600 max-w-3xl mx-auto">
            Discover amazing recipes, cooking tips, and culinary insights from
            talented chefs around the world. Share your own creations and
            connect with fellow food lovers.
          </p>
        </div>

        {/* Featured Posts Banner */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center">
              <span className="text-yellow-500 mr-2">⭐</span>
              Featured Recipes & Tips
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts
                .slice(0, 3)
                .map((post) =>
                  post.category === "review" ? (
                    <ReviewCard key={post.id} post={post} />
                  ) : (
                    <PostCard key={post.id} post={post} />
                  )
                )}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-orange-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recipes & Tips ({postsData.posts.length})
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-orange-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Chefs ({postsData.users.length})
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Create Post Button (only for authenticated users) */}
            {user && activeTab === "posts" && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                {showCreateForm ? "Cancel" : "Create Post"}
              </button>
            )}

            {/* Category Filter (only for posts) */}
            {activeTab === "posts" && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600">Filter:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Create Post Form */}
        {showCreateForm && user && activeTab === "posts" && (
          <div className="mb-8">
            <CreatePostForm
              onSuccess={() => {
                setShowCreateForm(false);
                refetch(); // Refresh posts data
              }}
            />
          </div>
        )}

        {/* Content */}
        {activeTab === "posts" ? (
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) =>
                post.category === "review" ? (
                  <ReviewCard key={post.id} post={post} />
                ) : (
                  <PostCard key={post.id} post={post} />
                )
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No posts found for the selected category.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {postsData.users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
