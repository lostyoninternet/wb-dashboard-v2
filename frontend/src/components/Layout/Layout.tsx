import React from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppBar } from './AppBar';

const theme = createTheme({
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
    }
});

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        pt: 10,
                        pb: 4,
                        backgroundColor: theme => theme.palette.grey[100]
                    }}
                >
                    <Container maxWidth="lg">{children}</Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
