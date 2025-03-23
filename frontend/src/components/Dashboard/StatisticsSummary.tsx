import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Statistics } from '../../types';

interface StatisticsSummaryProps {
    statistics: Statistics;
}

export const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({ statistics }) => {
    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('ru-RU').format(value);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Сводка статистики
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Продажи
                    </Typography>
                    <Typography variant="h4">
                        {formatNumber(statistics.summary.totalSales)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Выручка
                    </Typography>
                    <Typography variant="h4">
                        {formatNumber(statistics.summary.totalRevenue)} ₽
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Заказы
                    </Typography>
                    <Typography variant="h4">
                        {formatNumber(statistics.summary.ordersCount)}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};
