import React, { useState } from 'react';
import { 
    Paper,
    TextField,
    Button,
    Box,
    Typography,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getProduct, getStatistics } from '../../services/api';
import { Product, Statistics } from '../../types';

interface ProductSearchProps {
    onProductFound: (product: Product) => void;
    onStatisticsFound: (statistics: Statistics) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onProductFound, onStatisticsFound }) => {
    const [articleNumber, setArticleNumber] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!articleNumber) {
            setError('Введите артикул товара');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            // Получаем данные о товаре
            const product = await getProduct(articleNumber);
            onProductFound(product);

            // Получаем статистику за последний месяц
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            const statistics = await getStatistics(
                articleNumber,
                lastMonth.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );
            onStatisticsFound(statistics);
        } catch (error: any) {
            if (error.message === 'API ключ не установлен') {
                setError('Пожалуйста, введите API ключ Wildberries');
            } else {
                setError(error.response?.data?.error || 'Ошибка при получении данных');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Поиск товара
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <TextField
                    fullWidth
                    label="Артикул товара"
                    value={articleNumber}
                    onChange={(e) => setArticleNumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    disabled={loading || !articleNumber}
                >
                    {loading ? 'Загрузка...' : 'Поиск'}
                </Button>
            </Box>
        </Paper>
    );
};
