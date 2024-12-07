/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
    	extend: {
    		keyframes: {
    			popAndMoveUp: {
    				'0%': {
    					transform: 'scale(0)',
    					opacity: '0'
    				},
    				'30%': {
    					transform: 'scale(1.2)',
    					opacity: '1'
    				},
    				'50%': {
    					transform: 'scale(1)'
    				},
    				'100%': {
    					transform: 'scale(1) translateY(-200px)',
    					opacity: '0'
    				}
    			}
    		},
    		animation: {
    			popAndMoveUp: 'popAndMoveUp 0.8s ease-out'
    		},
    		screens: {
    			'440': '400px',
    			'1280': '1440px'
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {}
    	}
    },
	plugins: [require("tailwindcss-animate")],
};
