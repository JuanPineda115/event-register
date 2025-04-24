import { create } from 'zustand';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
    group_size: number;
    payment_type: string;
    allowed_gender_combinations: string[];
    event: number;
}

interface Event {
    id: number;
    name: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    registration_type: string;
    visibility: string;
    is_active: boolean;
    individual_price: string;
    individual_fee: string;
    group_price: string;
    group_fee: string;
    spectator_price: string;
    spectator_fee: string;
    image_url: string | null;
    categories: Category[];
}

interface EventState {
    event: Event | null;
    isLoading: boolean;
    error: string | null;
    fetchEvent: (eventId: string) => Promise<void>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const eventStore = create<EventState>((set) => ({
    event: null,
    isLoading: false,
    error: null,
    fetchEvent: async (eventId: string) => {
        set({ isLoading: true, error: null });

        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}/`,
                    {
                        headers: {
                            Authorization: `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                    }
                );

                set({ event: response.data, isLoading: false });
                return;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    set({ error: 'Event not found', isLoading: false });
                    return;
                }

                retries++;
                if (retries === MAX_RETRIES) {
                    set({ error: 'Failed to fetch event after multiple attempts', isLoading: false });
                    return;
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            }
        }
    },
}));

export default eventStore; 