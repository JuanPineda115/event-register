import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the step order and their corresponding routes
const stepRoutes = [
    { step: 0, path: '/event/[id]' },
    { step: 1, path: '/event/[id]/event-detail' },
    { step: 2, path: '/event/[id]/personal-info' },
    { step: 2, path: '/event/[id]/group-info' },
    { step: 3, path: '/event/[id]/payment' }
];

export function middleware(request: NextRequest) {
    // Only run middleware on registration-related routes
    if (!request.nextUrl.pathname.startsWith('/event/')) {
        return NextResponse.next();
    }

    // Get the current step from the session storage
    const registrationStorage = request.cookies.get('registration-storage');
    let currentStep = 0;

    if (registrationStorage) {
        try {
            const storageData = JSON.parse(registrationStorage.value);
            currentStep = storageData.state?.currentStepIndex || 0;
        } catch (e) {
            console.error('Error parsing registration storage:', e);
        }
    }

    // Find the required step for the current route
    const currentRoute = request.nextUrl.pathname;
    const requiredStep = stepRoutes.find(route =>
        currentRoute.match(new RegExp(route.path.replace('[id]', '[^/]+')))
    )?.step;

    // If we can't determine the required step, allow access
    if (requiredStep === undefined) {
        return NextResponse.next();
    }

    // If user is trying to access a step they haven't reached yet
    if (requiredStep > currentStep) {
        // Find the correct route for their current step
        const currentStepRoute = stepRoutes.find(route => route.step === currentStep);
        if (currentStepRoute) {
            // Replace [id] with the actual event ID
            const eventId = currentRoute.split('/')[2];
            const redirectPath = currentStepRoute.path.replace('[id]', eventId);
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/event/:path*',
    ],
}; 