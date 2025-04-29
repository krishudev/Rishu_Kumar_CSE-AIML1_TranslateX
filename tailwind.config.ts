
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme"; // Import default theme

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans], // Add Poppins as primary sans font
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
        // Notification color (uses accent/teal)
        notification: {
           DEFAULT: 'hsl(var(--notification))',
           foreground: 'hsl(var(--notification-foreground))',
        },
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
        // Sidebar colors (kept but not actively used in this mobile layout)
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
        // Default radius is 12px (rounded-xl)
        xl: 'var(--radius)', // Maps to rounded-xl (12px)
        // Adjust other sizes based on the new default
        '2xl': 'calc(var(--radius) + 4px)', // 16px
  			lg: 'calc(var(--radius) - 4px)', // 8px
  			md: 'calc(var(--radius) - 6px)', // 6px
  			sm: 'calc(var(--radius) - 8px)' // 4px
  		},
      boxShadow: {
          // Standard shadow for mobile cards
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
           // Glow effect for dark mode
           'glow-dark': '0 0 6px hsl(var(--accent)), 0 0 12px hsl(var(--accent))',
      },
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
        'pulse-mic': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
         'fade-in': {
            'from': { opacity: '0', transform: 'translateY(10px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'ripple-animation': {
             'to': { transform: 'scale(4)', opacity: '0' }
        },
         'glow-border-dark': {
           'from': { boxShadow: '0 0 3px hsl(var(--accent) / 0.6), 0 0 6px hsl(var(--accent) / 0.4)' },
           'to': { boxShadow: '0 0 6px hsl(var(--accent) / 0.8), 0 0 12px hsl(var(--accent) / 0.6)' },
         },
         'bounce-click': {
           '0%': { transform: 'scale(1)' },
           '50%': { transform: 'scale(0.9)' },
           '100%': { transform: 'scale(1)' },
         },
          'blink': {
           '50%': { borderColor: 'transparent' },
         },
         // Shimmer animation for skeletons
         'shimmer': {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' },
         }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-mic': 'pulse-mic 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 300ms ease-out forwards', // Use 300ms for fade-in
        'ripple': 'ripple-animation 0.3s linear', // Faster ripple (300ms)
         'glow-border-dark': 'glow-border-dark 1.5s ease-in-out infinite alternate',
         'bounce-click': 'bounce-click 200ms ease-in-out forwards',
         'blink': 'blink 1s step-start infinite',
         'shimmer': 'shimmer 1.5s infinite linear', // Shimmer utility
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
