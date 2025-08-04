import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/AuthContext";
import { NavWrapped } from "@/components/navwrapped";
import { CardWrapped } from "@/components/CardWrappedNew";
import { PostsPage } from "@/components/PostsPage";
import { LoginForm } from "@/components/LoginForm";
import { SignUpForm } from "@/components/siginUpForm";
import Contact from "@/components/contact";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
            <NavWrapped />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<CardWrapped />} />
                <Route path="/recipes" element={<CardWrapped />} />
                <Route path="/reviews" element={<PostsPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
