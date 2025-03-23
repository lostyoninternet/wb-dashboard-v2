export interface Product {
    nmId: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    discount: number;
}

export interface Statistics {
    summary: {
        totalSales: number;
        totalRevenue: number;
        ordersCount: number;
    };
    details: Array<{
        date: string;
        sales: {
            quantity: number;
            revenue: number;
        };
        orders: {
            quantity: number;
            canceled: number;
        };
        views: {
            total: number;
            unique: number;
        };
    }>;
    stocks: {
        current: number;
        warehouses: Array<{
            warehouse: string;
            quantity: number;
        }>;
    };
}

export interface ApiError {
    error: string;
    details?: string;
}
