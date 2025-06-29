/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,css}',       
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    // Add specific paths for better performance
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/services/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#fef7ee',
          100: '#fdeed5',
          200: '#fbd9aa',
          300: '#f8bf74',
          400: '#f59e0b',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced glass morphism colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.1)',
          darker: 'rgba(0, 0, 0, 0.2)',
          frost: 'rgba(255, 255, 255, 0.15)',
          smoke: 'rgba(0, 0, 0, 0.05)',
        },
        // Enhanced neumorphism colors
        neuro: {
          light: '#f0f0f0',
          dark: '#e0e0e0',
          shadow: '#c8c8c8',
          highlight: '#ffffff',
          base: '#f5f5f5',
          pressed: '#d9d9d9',
        },
        // Status colors for microservice communication
        status: {
          online: '#22c55e',
          offline: '#ef4444',
          warning: '#f59e0b',
          pending: '#6366f1',
          loading: '#8b5cf6',
        },
        // Order status colors
        order: {
          pending: '#f59e0b',
          confirmed: '#0ea5e9',
          preparing: '#8b5cf6',
          ready: '#22c55e',
          completed: '#64748b',
          cancelled: '#ef4444',
        },
        // Service health colors
        service: {
          healthy: '#10b981',
          degraded: '#f59e0b',
          down: '#ef4444',
          unknown: '#64748b',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        glass: "20px",
        neuro: "15px",
        card: "12px",
        button: "8px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "glass-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "neuro-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        // Enhanced animations for microservice UI
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Loading animations for API calls
        "dots": {
          "0%, 20%": { color: "transparent" },
          "50%": { color: "currentColor" },
          "80%, 100%": { color: "transparent" },
        },
        "bars": {
          "0%, 40%, 100%": { transform: "scaleY(0.4)" },
          "20%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glass-float": "glass-float 3s ease-in-out infinite",
        "neuro-pulse": "neuro-pulse 2s ease-in-out infinite",
        // Enhanced animations
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-delay": "fade-in 0.7s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "dots-1": "dots 1.4s infinite ease-in-out both",
        "dots-2": "dots 1.4s infinite ease-in-out both 0.16s",
        "dots-3": "dots 1.4s infinite ease-in-out both 0.32s",
        "bars-1": "bars 1.2s infinite ease-in-out both",
        "bars-2": "bars 1.2s infinite ease-in-out both 0.1s",
        "bars-3": "bars 1.2s infinite ease-in-out both 0.2s",
        "bars-4": "bars 1.2s infinite ease-in-out both 0.3s",
      },
      backdropBlur: {
        glass: "16px",
        "glass-strong": "24px",
        "glass-subtle": "8px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-inset": "inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
        "neuro-light": "6px 6px 12px #c8c8c8, -6px -6px 12px #ffffff",
        "neuro-dark": "inset 6px 6px 12px #c8c8c8, inset -6px -6px 12px #ffffff",
        "neuro-flat": "3px 3px 6px #c8c8c8, -3px -3px 6px #ffffff",
        "neuro-pressed": "inset 3px 3px 6px #c8c8c8, inset -3px -3px 6px #ffffff",
        // Enhanced shadows for better depth
        "card-hover": "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "button-hover": "0 4px 15px rgba(0, 0, 0, 0.2)",
        "status-glow": "0 0 10px rgba(34, 197, 94, 0.5)",
        "error-glow": "0 0 10px rgba(239, 68, 68, 0.5)",
        "warning-glow": "0 0 10px rgba(245, 158, 11, 0.5)",
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
        "neuro-gradient": "linear-gradient(145deg, #f0f0f0, #e0e0e0)",
        "dark-glass": "linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))",
        // Enhanced gradients for microservice UI
        "primary-gradient": "linear-gradient(135deg, #f59e0b, #d97706)",
        "secondary-gradient": "linear-gradient(135deg, #0ea5e9, #0284c7)",
        "success-gradient": "linear-gradient(135deg, #22c55e, #16a34a)",
        "error-gradient": "linear-gradient(135deg, #ef4444, #dc2626)",
        "shimmer-gradient": "linear-gradient(90deg, transparent 25%, rgba(255, 255, 255, 0.1) 50%, transparent 75%)",
        "status-online": "radial-gradient(circle, #22c55e, #16a34a)",
        "status-offline": "radial-gradient(circle, #ef4444, #dc2626)",
      },
      // Enhanced spacing for better layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '128': '32rem',
      },
      // Typography improvements
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      // Enhanced z-index scale
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Transition durations
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
        '1200': '1200ms',
        '1500': '1500ms',
      },
      // Grid template columns for responsive layouts
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add custom utilities for microservice UI
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Service status indicators
        '.status-indicator': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            right: '0',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: theme('colors.status.online'),
          },
        },
        '.status-offline::after': {
          backgroundColor: theme('colors.status.offline'),
        },
        '.status-warning::after': {
          backgroundColor: theme('colors.status.warning'),
        },
        // Loading skeleton utilities
        '.skeleton': {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        },
        // Interactive glass morphism
        '.glass-interactive': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        // Neumorphism button states
        '.neuro-button': {
          background: theme('colors.neuro.base'),
          boxShadow: theme('boxShadow.neuro-flat'),
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.neuro-light'),
          },
          '&:active': {
            boxShadow: theme('boxShadow.neuro-pressed'),
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};