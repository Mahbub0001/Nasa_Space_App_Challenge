/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#04060A',
          900: '#070A0F',
          850: '#0B1017',
          800: '#0F1622',
          750: '#141D2B',
          700: '#1A2536',
          650: '#212E42',
          600: '#2A3A52',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          borderActive: 'rgba(56, 189, 248, 0.4)',
        },
        telemetry: {
          cyan: '#00D2FF',
          blue: '#38BDF8',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          text: '#F1F5F9',
          muted: '#94A3B8',
          dim: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif']
      },
      letterSpacing: {
        widestTechnical: '0.14em',
      },
      boxShadow: {
        'aerospace': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        'subtle-glow': '0 0 12px rgba(56, 189, 248, 0.12)',
        'amber-glow': '0 0 12px rgba(245, 158, 11, 0.15)',
        'red-glow': '0 0 12px rgba(239, 68, 68, 0.2)',
      }
    },
  },
  plugins: [],
}
