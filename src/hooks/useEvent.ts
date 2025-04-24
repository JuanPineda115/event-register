import { useEffect } from 'react';
import { useRouter } from 'next/router';
import eventStore from '../store/eventStore';

const useEvent = () => {
    const router = useRouter();
    const { eventId } = router.query;
    const { event, isLoading, error, fetchEvent } = eventStore();

    useEffect(() => {
        if (eventId && typeof eventId === 'string') {
            fetchEvent(eventId);
        }
    }, [eventId, fetchEvent]);

    useEffect(() => {
        if (error === 'Event not found') {
            router.push('/404');
        }
    }, [error, router]);

    return {
        event,
        isLoading,
        error,
    };
};

export default useEvent; 