import React from 'react';
import { Typography, Box } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Statistics } from '../../types';

interface StatisticsChartProps {
    statistics: Statistics;
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ statistics }) => {
    const data = statistics.details.map(item => ({
        date: new Date(item.date).toLocaleDateString('ru-RU'),
        sales: item.sales.quantity,
        revenue: item.sales.revenue,
        orders: item.orders.quantity
    }));

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('ru-RU').format(value);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                График продаж
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={formatNumber} />
                        <Tooltip formatter={formatNumber} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            name="Продажи"
                            stroke="#2196f3"
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            name="Заказы"
                            stroke="#4caf50"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};
