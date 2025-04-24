import { RegistrationRequest } from '../types/registration';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export const registerForEvent = async (data: RegistrationRequest) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register/`, data, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Registration error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
        throw error;
    }
}; 