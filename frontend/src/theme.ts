import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#cb11ab',
            light: '#ff5ddc',
            dark: '#96007c'
        },
        secondary: {
            main: '#2196f3',
            light: '#6ec6ff',
            dark: '#0069c0'
        },
        background: {
            default: '#f5f5f5'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif'
        ].join(',')
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            }
        }
    }
});
