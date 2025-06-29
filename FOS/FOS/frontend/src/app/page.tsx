"use client";
import "../styles/globals.css";
import "../styles/layout.css";
import "../styles/components.css";
import "../styles/animation.css"; // Fixed filename

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Shield,
  Truck,
  Star,
  ChefHat,
  Users,
  MapPin,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";

// Import microservice connections
import { menuService, MenuItemDTO } from "@/services/menuService";
import { orderService } from "@/services/orderService";
import { userService } from "@/services/userService";
import { checkAllServicesHealth } from "@/services/api";
import toast from "react-hot-toast";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  // State for microservice data
  const [featuredItems, setFeaturedItems] = useState<MenuItemDTO[]>([]);
  const [totalMenuItems, setTotalMenuItems] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgRating] = useState(4.8); // This could come from reviews service
  const [servicesHealth, setServicesHealth] = useState({
    userService: false,
    menuService: false,
    orderService: false,
  });
  const [loading, setLoading] = useState(true);

  // Fetch data from microservices
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);

        // Check microservices health
        const healthStatus = await checkAllServicesHealth();
        setServicesHealth(healthStatus);

        // Only fetch data if services are healthy
        const promises = [];

        // Fetch featured menu items from Menu Service
        if (healthStatus.menuService) {
          promises.push(
            menuService
              .getRecommendedItems(6)
              .then((items) => {
                setFeaturedItems(items);
                return menuService.getAllMenuItems();
              })
              .then((allItems) => {
                setTotalMenuItems(allItems.length);
              })
              .catch((error) => {
                console.error("Menu service error:", error);
                toast.error("Failed to load menu data");
              })
          );
        }

        // Fetch user statistics from User Service (if admin/staff)
        if (healthStatus.userService && user && userService.isStaff()) {
          promises.push(
            userService
              .getAllUsers()
              .then((users) => {
                setTotalCustomers(
                  users.filter((u) => u.role === "CUSTOMER").length
                );
              })
              .catch((error) => {
                console.error("User service error:", error);
                // Don't show error toast for user stats as it's not critical
              })
          );
        }

        // Fetch order statistics from Order Service (if admin/staff)
        if (healthStatus.orderService && user && userService.isStaff()) {
          promises.push(
            orderService
              .getAllOrders()
              .then((orders) => {
                setTotalOrders(orders.length);
              })
              .catch((error) => {
                console.error("Order service error:", error);
                // Don't show error toast for order stats as it's not critical
              })
          );
        }

        // Wait for all promises to complete
        await Promise.allSettled(promises);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        toast.error("Some services are temporarily unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, [user]);

  // Dynamic stats based on microservice data
  const stats = [
    {
      number: loading ? "..." : `${totalCustomers || 50}K+`,
      label: "Happy Customers",
      source: servicesHealth.userService ? "live" : "estimate",
    },
    {
      number: loading ? "..." : `${totalMenuItems || 100}+`,
      label: "Menu Items",
      source: servicesHealth.menuService ? "live" : "estimate",
    },
    {
      number: "15+",
      label: "Restaurant Partners",
      source: "static", // This could come from a partners service
    },
    {
      number: avgRating.toString(),
      label: "Average Rating",
      source: "calculated", // This could come from a reviews service
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Get your food delivered in 30 minutes or less",
      color: "text-blue-400",
      status: servicesHealth.orderService ? "available" : "limited",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your payments and data are completely secure",
      color: "text-green-400",
      status: servicesHealth.userService ? "available" : "limited",
    },
    {
      icon: ChefHat,
      title: "Quality Food",
      description: "Fresh ingredients and expert chefs",
      color: "text-orange-400",
      status: servicesHealth.menuService ? "available" : "limited",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "We are here to help you anytime",
      color: "text-purple-400",
      status: "available",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Amazing food quality and super fast delivery! The app is so easy to use.",
      location: "Downtown",
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment:
        "Best food delivery service in the city. Never disappointed with the quality.",
      location: "Midtown",
    },
    {
      name: "Emma Davis",
      rating: 5,
      comment:
        "Love the variety of options and the real-time order tracking feature.",
      location: "Uptown",
    },
  ];

  return (
    <Layout>
      {/* Service Status Indicator (only show if there are issues) */}
      {(!servicesHealth.menuService ||
        !servicesHealth.orderService ||
        !servicesHealth.userService) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Some services are temporarily unavailable. Basic functionality
                is still available.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 glass-card rounded-full floating-element opacity-20"></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 glass-card rounded-full floating-element opacity-30"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-32 h-32 glass-card rotate-45 floating-element opacity-25"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold glass-text leading-tight">
                Delicious Food
                <br />
                <span className="text-white/80">Delivered Fast</span>
              </h1>
              <p className="text-xl md:text-2xl glass-text max-w-2xl mx-auto leading-relaxed">
                Experience the finest cuisine with our modern ordering system.
                Fresh ingredients, expert chefs, and lightning-fast delivery.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={isAuthenticated ? "/menu" : "/auth/register"}>
                <Button
                  size="lg"
                  className="neuro-button text-lg px-8 py-4 group"
                  disabled={!servicesHealth.menuService && isAuthenticated}
                >
                  {isAuthenticated ? "Browse Menu" : "Get Started"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/menu">
                <Button
                  variant="outline"
                  size="lg"
                  className="interactive-glass text-lg px-8 py-4"
                  disabled={!servicesHealth.menuService}
                >
                  View Menu
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="hybrid-card p-6 text-center relative"
                >
                  <div className="text-2xl md:text-3xl font-bold glass-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm glass-text opacity-80">
                    {stat.label}
                  </div>
                  {/* Live data indicator */}
                  {stat.source === "live" && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section (only show if menu service is available) */}
      {servicesHealth.menuService && featuredItems.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-50/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold neuro-text mb-4">
                Featured Dishes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our most popular and highly-rated menu items
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredItems.slice(0, 6).map((item, index) => (
                <div key={item.itemId} className="menu-item-card group">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg mb-4 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.itemName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold neuro-text mb-2">
                      {item.itemName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-primary">
                        {menuService.formatPrice(item.price)}
                      </span>
                      {item.preparationTime && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {menuService.formatPreparationTime(
                            item.preparationTime
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/menu">
                <Button size="lg" className="neuro-button">
                  View Full Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold neuro-text mb-4">
              Why Choose FoodOrder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best food delivery experience with modern
              technology and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="menu-item-card text-center group relative"
              >
                <div
                  className={`neuro-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-neuro-flat transition-all duration-300 ${
                    feature.status === "limited" ? "opacity-60" : ""
                  }`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold neuro-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>

                {/* Service status indicator */}
                {feature.status === "limited" && (
                  <div className="absolute top-2 right-2">
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                      title="Limited availability"
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold neuro-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ordering your favorite food is just a few clicks away
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse Menu",
                description:
                  "Explore our wide variety of delicious dishes from top restaurants",
                icon: ChefHat,
                serviceRequired: "menuService",
              },
              {
                step: "02",
                title: "Place Order",
                description:
                  "Add items to cart, customize your order, and checkout securely",
                icon: Users,
                serviceRequired: "orderService",
              },
              {
                step: "03",
                title: "Fast Delivery",
                description:
                  "Track your order in real-time and enjoy fresh, hot food",
                icon: Truck,
                serviceRequired: "orderService",
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-4"></div>
                )}

                <div
                  className={`hybrid-card p-8 relative ${
                    !servicesHealth[
                      step.serviceRequired as keyof typeof servicesHealth
                    ]
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="neuro-card w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  <div className="neuro-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-gray-700" />
                  </div>

                  <h3 className="text-xl font-semibold neuro-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>

                  {/* Service status indicator */}
                  {!servicesHealth[
                    step.serviceRequired as keyof typeof servicesHealth
                  ] && (
                    <div className="absolute top-2 right-2">
                      <div
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                        title="Service temporarily unavailable"
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold neuro-text mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who love our service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="hybrid-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card-dark p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold glass-text mb-4">
              Ready to Order?
            </h2>
            <p className="text-xl glass-text mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers and experience the best food
              delivery service in the city
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={isAuthenticated ? "/menu" : "/auth/register"}>
                <Button
                  size="lg"
                  className="neuro-button text-lg px-8 py-4"
                  disabled={!servicesHealth.menuService && isAuthenticated}
                >
                  {isAuthenticated ? "Order Now" : "Sign Up Now"}
                </Button>
              </Link>
              <Link href="/menu">
                <Button
                  variant="outline"
                  size="lg"
                  className="interactive-glass text-lg px-8 py-4"
                  disabled={!servicesHealth.menuService}
                >
                  Browse Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
