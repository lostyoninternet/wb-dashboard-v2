import React, { useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import { ProductSearch } from '../components/Dashboard/ProductSearch';
import { ProductInfo } from '../components/Dashboard/ProductInfo';
import { StatisticsSummary } from '../components/Dashboard/StatisticsSummary';
import { StatisticsChart } from '../components/Dashboard/StatisticsChart';
import { Product, Statistics } from '../types';

export const Dashboard: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [statistics, setStatistics] = useState<Statistics | null>(null);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Поиск товара */}
                <Grid item xs={12}>
                    <ProductSearch
                        onProductFound={setProduct}
                        onStatisticsFound={setStatistics}
                    />
                </Grid>

                {/* Информация о товаре */}
                {product && (
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <ProductInfo product={product} />
                        </Paper>
                    </Grid>
                )}

                {/* Сводка статистики */}
                {statistics && (
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <StatisticsSummary statistics={statistics} />
                        </Paper>
                    </Grid>
                )}

                {/* График статистики */}
                {statistics && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <StatisticsChart statistics={statistics} />
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};
