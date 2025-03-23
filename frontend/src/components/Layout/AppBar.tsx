import React from 'react';
import {
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    TextField,
    Box,
    useTheme
} from '@mui/material';
import { getStoredApiKey, setApiKey } from '../../services/api';

export const AppBar: React.FC = () => {
    const theme = useTheme();
    const [apiKey, setLocalApiKey] = React.useState(getStoredApiKey() || '');

    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newApiKey = event.target.value;
        setLocalApiKey(newApiKey);
        setApiKey(newApiKey);
    };

    return (
        <MuiAppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Wildberries Dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        type="password"
                        label="API Ключ"
                        value={apiKey}
                        onChange={handleApiKeyChange}
                        sx={{
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                            width: 300
                        }}
                    />
                </Box>
            </Toolbar>
        </MuiAppBar>
    );
};
