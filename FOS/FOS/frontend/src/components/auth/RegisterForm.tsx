// src/components/auth/RegisterForm.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { useNotification } from '@/context/NotificationContext'; // Comment out if not available
import { authService } from "@/services/authService";
import { UserRegistrationDTO } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast"; // Using react-hot-toast instead

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth(); // Using register from AuthContext
  // const { addNotification } = useNotification(); // Comment out if not available

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation using authService
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!authService.validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation using authService
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = authService.validatePassword(
        formData.password
      );
      if (!passwordValidation.isValid) {
        newErrors.password =
          passwordValidation.message || "Password is invalid";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Phone validation (optional but if provided should be valid)
    if (formData.phoneNumber && formData.phoneNumber.trim().length > 0) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber =
          "Please enter a valid phone number (at least 10 digits)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData); // Debug log

    // Validate form first
    if (!validateForm()) {
      console.log("Form validation failed:", errors); // Debug log
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    console.log("Starting registration process..."); // Debug log

    try {
      // Check if email already exists
      console.log("Checking if email exists..."); // Debug log
      const emailExists = await authService.checkEmailExists(formData.email);
      if (emailExists) {
        setErrors({ email: "An account with this email already exists" });
        toast.error("Email already exists");
        setIsLoading(false);
        return;
      }

      // Prepare registration data
      const registrationData: UserRegistrationDTO = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
        address: formData.address?.trim() || undefined,
      };

      console.log("Registration data prepared:", registrationData); // Debug log

      // Register user using AuthContext
      console.log("Calling register function..."); // Debug log
      await register(registrationData);

      // Success notification
      toast.success(`Welcome to FoodOrder, ${formData.firstName}!`);

      // Optional: Use notification context if available
      /*
      addNotification({
        type: 'success',
        title: 'Registration Successful',
        message: `Welcome to FoodOrder, ${formData.firstName}!`
      });
      */

      console.log("Registration successful, redirecting..."); // Debug log

      // Redirect to menu or dashboard
      router.push("/menu");
    } catch (error: any) {
      console.error("Registration failed:", error); // Debug log

      // Handle specific error types
      let errorMessage = "Registration failed. Please try again.";

      if (error.message) {
        errorMessage = error.message;

        // Set specific field errors based on error message
        if (error.message.toLowerCase().includes("email")) {
          setErrors({ email: "Email is invalid or already exists" });
        } else if (error.message.toLowerCase().includes("password")) {
          setErrors({ password: "Password does not meet requirements" });
        }
      }

      toast.error(errorMessage);

      // Optional: Use notification context if available
      /*
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage
      });
      */
    } finally {
      setIsLoading(false);
      console.log("Registration process completed"); // Debug log
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Register Card */}
        <div className="hybrid-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="neuro-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold neuro-text">Create Account</h1>
            <p className="text-gray-600">
              Join us and start ordering delicious food
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="neuro-text font-medium">
                  First Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`neuro-input pl-10 ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="First name"
                    disabled={isLoading}
                    required
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="neuro-text font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`neuro-input ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                  placeholder="Last name"
                  disabled={isLoading}
                  required
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="neuro-text font-medium">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`neuro-input pl-10 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="neuro-text font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`neuro-input pl-10 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Password"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="neuro-text font-medium"
                >
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`neuro-input pl-10 pr-10 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    placeholder="Confirm password"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="neuro-text font-medium">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`neuro-input pl-10 ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <Label htmlFor="address" className="neuro-text font-medium">
                Address <span className="text-gray-400">(Optional)</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="neuro-input pl-10 min-h-[80px] resize-none w-full"
                  placeholder="Enter your full address"
                  disabled={isLoading}
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full neuro-button text-gray-700 font-medium h-12 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-t-transparent"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </div>
              )}
            </Button>
          </form>

          {/* Terms and Privacy */}
          <div className="text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-gray-700 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-700 hover:underline">
              Privacy Policy
            </Link>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-gray-800 hover:text-gray-900 transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="glass-card mt-6 p-4 text-center">
          <p className="text-sm glass-text">
            🔒 We protect your privacy and never share your data
          </p>
        </div>
      </div>
    </div>
  );
}
