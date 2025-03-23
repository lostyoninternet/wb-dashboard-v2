import React from 'react';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Skeleton,
    Box
} from '@mui/material';
import { Product } from '../../types';

interface ProductInfoProps {
    product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Информация о товаре
            </Typography>
            <List>
                <ListItem>
                    <ListItemText
                        primary="Название"
                        secondary={product.name}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Бренд"
                        secondary={product.brand}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Категория"
                        secondary={product.category}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Цена"
                        secondary={`${product.price} ₽`}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Скидка"
                        secondary={`${product.discount}%`}
                    />
                </ListItem>
            </List>
        </Box>
    );
};
