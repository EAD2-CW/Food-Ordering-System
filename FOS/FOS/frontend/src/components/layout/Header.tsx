// src/components/layout/Header.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  UserCircle,
  History,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart(); // <-- fixed here

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const totalCartItems = totalItems; // <-- use totalItems directly

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/orders/track", label: "Track Order" },
  ];

  return (
    <>
      {/* Glassmorphism Navigation */}
      <nav className="glass-nav">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="neuro-card p-2 group-hover:shadow-neuro-flat transition-all duration-300">
                <ChefHat className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold glass-text">
                Food<span className="text-white/80">Order</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="glass-text hover:text-white transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="interactive-glass relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalCartItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-neuro-pulse"
                    >
                      {totalCartItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="interactive-glass"
                    >
                      <UserCircle className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline glass-text">
                        {user?.firstName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="glass-card glass-text w-56"
                    align="end"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="glass-text">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="glass-text">
                        <History className="mr-2 h-4 w-4" />
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="glass-text">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="glass-text"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="interactive-glass"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="neuro-button">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden interactive-glass"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="glass-card-dark m-4 p-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block glass-text text-lg hover:text-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <hr className="border-white/20" />

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  href="/profile"
                  className="flex items-center glass-text text-lg hover:text-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center glass-text text-lg hover:text-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <History className="mr-3 h-5 w-5" />
                  Order History
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center glass-text text-lg hover:text-white transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center glass-text text-lg hover:text-white transition-colors duration-300 w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="block glass-text text-lg hover:text-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block glass-text text-lg hover:text-white transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
