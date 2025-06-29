// Enhanced LoginForm with comprehensive debugging and fallback
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginRequestDTO {
  email: string;
  password: string;
}

interface UserResponseDTO {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Mock users for fallback authentication
  const mockUsers = {
    "admin@foodorder.com": {
      userId: 1,
      email: "admin@foodorder.com",
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN" as const,
      password: "admin123",
    },
    "staff@foodorder.com": {
      userId: 2,
      email: "staff@foodorder.com",
      firstName: "Staff",
      lastName: "Member",
      role: "STAFF" as const,
      password: "staff123",
    },
    "customer@foodorder.com": {
      userId: 3,
      email: "customer@foodorder.com",
      firstName: "Customer",
      lastName: "User",
      role: "CUSTOMER" as const,
      password: "customer123",
    },
  };

  const addDebugInfo = (info: string) => {
    console.log("🔍 DEBUG:", info);
    setDebugInfo((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${info}`,
    ]);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mockAuthenticate = (
    email: string,
    password: string
  ): UserResponseDTO | null => {
    const user = mockUsers[email as keyof typeof mockUsers];
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  };

  const testBackendConnectivity = async (): Promise<boolean> => {
    try {
      addDebugInfo("Testing backend connectivity...");

      // Test health endpoint first
      const healthResponse = await fetch(
        "http://localhost:8083/api/users/health",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (healthResponse.ok) {
        addDebugInfo("✅ Backend health check passed");
        return true;
      } else {
        addDebugInfo(
          `❌ Backend health check failed: ${healthResponse.status}`
        );
        return false;
      }
    } catch (error) {
      addDebugInfo(`❌ Backend connectivity failed: ${error}`);
      return false;
    }
  };

  const tryBackendLogin = async (
    credentials: LoginRequestDTO
  ): Promise<UserResponseDTO | null> => {
    try {
      addDebugInfo(`Attempting backend login for: ${credentials.email}`);

      const response = await fetch("http://localhost:8083/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      addDebugInfo(`Backend response status: ${response.status}`);

      const responseText = await response.text();
      addDebugInfo(`Backend response: ${responseText.substring(0, 200)}...`);

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}: ${responseText}`);
      }

      const apiResponse: ApiResponse<UserResponseDTO> =
        JSON.parse(responseText);

      if (!apiResponse.success) {
        throw new Error(
          apiResponse.error || apiResponse.message || "Backend login failed"
        );
      }

      addDebugInfo(
        `✅ Backend login successful for: ${apiResponse.data.email}`
      );
      return apiResponse.data;
    } catch (error: any) {
      addDebugInfo(`❌ Backend login failed: ${error.message}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Starting login process...");
    setDebugInfo([]);

    // Clear previous errors
    setErrors({});

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const credentials: LoginRequestDTO = {
        email: formData.email.trim(),
        password: formData.password,
      };

      addDebugInfo(`Login attempt for: ${credentials.email}`);

      let userData: UserResponseDTO | null = null;
      let loginMethod = "";

      // First, test backend connectivity
      const backendAvailable = await testBackendConnectivity();

      if (backendAvailable) {
        // Try backend login first
        try {
          userData = await tryBackendLogin(credentials);
          loginMethod = "backend";
        } catch (backendError: any) {
          addDebugInfo(`Backend login failed, trying mock login...`);

          // Fall back to mock authentication
          userData = mockAuthenticate(credentials.email, credentials.password);
          if (userData) {
            loginMethod = "mock";
            addDebugInfo(`✅ Mock login successful for: ${userData.email}`);
          } else {
            addDebugInfo(`❌ Mock login failed - invalid credentials`);
          }
        }
      } else {
        // Backend not available, use mock authentication
        addDebugInfo("Backend unavailable, using mock authentication");
        userData = mockAuthenticate(credentials.email, credentials.password);
        if (userData) {
          loginMethod = "mock";
          addDebugInfo(`✅ Mock login successful for: ${userData.email}`);
        }
      }

      if (!userData) {
        throw new Error("Invalid email or password");
      }

      // Store user data
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loginMethod", loginMethod);

      // Success notification
      const welcomeMessage = userData.firstName
        ? `Welcome back, ${userData.firstName}! (${loginMethod})`
        : `Welcome back! (${loginMethod})`;

      toast.success(welcomeMessage);
      addDebugInfo(`✅ Login completed via ${loginMethod}`);

      // Redirect based on user role
      const routes = {
        ADMIN: "/admin",
        STAFF: "/orders",
        CUSTOMER: "/menu",
      };

      const targetRoute = routes[userData.role] || "/menu";
      addDebugInfo(`Redirecting to: ${targetRoute}`);

      setTimeout(() => {
        router.push(targetRoute);
      }, 1000); // Small delay to show success message
    } catch (error: any) {
      console.error("💥 Login process failed:", error);
      addDebugInfo(`❌ Final login failure: ${error.message}`);

      let errorMessage = "Login failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;

        if (
          error.message.toLowerCase().includes("email") ||
          error.message.toLowerCase().includes("not found")
        ) {
          setErrors({ email: "Email not found" });
        } else if (
          error.message.toLowerCase().includes("password") ||
          error.message.toLowerCase().includes("incorrect")
        ) {
          setErrors({ password: "Incorrect password" });
        } else if (
          error.message.toLowerCase().includes("credentials") ||
          error.message.toLowerCase().includes("invalid")
        ) {
          setErrors({ general: "Invalid email or password" });
        } else {
          setErrors({ general: errorMessage });
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
    setErrors({});
    setDebugInfo([]);
    toast.success("Demo credentials loaded. Click Sign In to continue.", {
      duration: 3000,
      icon: "ℹ️",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="bg-gray-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-lg">
              <LogIn className="h-8 w-8 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          {/* Debug Info */}
          {debugInfo.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-xs font-medium mb-2">
                Debug Info:
              </p>
              {debugInfo.map((info, index) => (
                <p key={index} className="text-blue-700 text-xs">
                  {info}
                </p>
              ))}
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center font-medium">
              Try Demo Accounts:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDemoLogin("admin@foodorder.com", "admin123")
                }
                className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-3 px-4 rounded-lg transition-colors"
                disabled={isLoading}
              >
                🔧 Admin Demo (admin@foodorder.com)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoLogin("staff@foodorder.com", "staff123")
                }
                className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-3 px-4 rounded-lg transition-colors"
                disabled={isLoading}
              >
                👨‍🍳 Staff Demo (staff@foodorder.com)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDemoLogin("customer@foodorder.com", "customer123")
                }
                className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-3 px-4 rounded-lg transition-colors"
                disabled={isLoading}
              >
                🍕 Customer Demo (customer@foodorder.com)
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Click a demo button to load credentials, then click Sign In
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Backend Status */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Multi-layer authentication (Backend + Fallback)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
