import axios from 'axios';
import { Product, Statistics } from '../types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
});

// Инициализация API ключа из localStorage при запуске
const storedApiKey = localStorage.getItem('wb_api_key');
if (storedApiKey) {
    api.defaults.headers.common['x-api-key'] = storedApiKey;
}

export const setApiKey = (apiKey: string): void => {
    if (apiKey) {
        api.defaults.headers.common['x-api-key'] = apiKey;
        localStorage.setItem('wb_api_key', apiKey);
    } else {
        delete api.defaults.headers.common['x-api-key'];
        localStorage.removeItem('wb_api_key');
    }
};

export const getStoredApiKey = (): string | null => {
    return localStorage.getItem('wb_api_key');
};

export const getProduct = async (articleNumber: string): Promise<Product> => {
    if (!api.defaults.headers.common['x-api-key']) {
        throw new Error('API ключ не установлен');
    }
    const response = await api.get(`/products/${articleNumber}`);
    return response.data;
};

export const getStatistics = async (
    articleNumber: string,
    dateFrom: string,
    dateTo: string
): Promise<Statistics> => {
    if (!api.defaults.headers.common['x-api-key']) {
        throw new Error('API ключ не установлен');
    }
    const response = await api.get(`/statistics/${articleNumber}`, {
        params: { dateFrom, dateTo }
    });
    return response.data;
};

// Интерцептор для обработки ошибок
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            setApiKey(''); // Очищаем API ключ при ошибке авторизации
        }
        return Promise.reject(error);
    }
);
