import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";

export function NavWrapped() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-8">
        <div className="flex h-20 items-center justify-between w-full">
          {/* Logo and Navigation Menu */}
          <div className="flex items-center gap-8 flex-grow">
            <h1 className="text-2xl font-bold text-orange-600 whitespace-nowrap">
              L&amp;A Recipe
            </h1>
            <NavigationMenu className="flex-grow max-w-none w-full">
              <NavigationMenuList className="flex items-center gap-8 w-full">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/contact"
                      className="px-6 py-2 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-orange-100 rounded-md transition-all duration-200"
                    >
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/recipes"
                      className="px-6 py-2 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-orange-100 rounded-md transition-all duration-200"
                    >
                      Recipes
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/reviews"
                      className="px-6 py-2 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-orange-100 rounded-md transition-all duration-200"
                    >
                      Reviews
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>{" "}
          {/* User Authentication */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-lg font-medium text-gray-700 bg-orange-50 px-4 py-2 rounded-lg">
                  Welcome, Chef {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-lg font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-orange-100 rounded-md transition-all duration-200"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-6 py-2 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-orange-100 rounded-md transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
