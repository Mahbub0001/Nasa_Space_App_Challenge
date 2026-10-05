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
          950: '#0B1119',
          900: '#101923',
          850: '#15212D',
          800: '#1A2835',
          750: '#203140',
          700: '#293D4D',
          650: '#334A5D',
          600: '#3D5669',
          border: 'rgba(181, 200, 216, 0.16)',
          borderSubtle: 'rgba(181, 200, 216, 0.10)',
          borderActive: 'rgba(122, 172, 204, 0.55)',
        },
        telemetry: {
          cyan: '#8EB8D2',
          blue: '#7AA8C6',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          text: '#E9EEF2',
          muted: '#A4B2BF',
          dim: '#7F91A1',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Inter Variable', 'Inter', 'sans-serif']
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
