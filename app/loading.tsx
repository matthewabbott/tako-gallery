import { LoadingState } from '@/components/LoadingState';

/**
 * Global loading page for Next.js app router
 * This component is rendered when a route segment is loading
 */
export default function GlobalLoading() {
    return (
        <LoadingState
            fullPage
            size="lg"
            text="Loading Tako Gallery..."
        />
    );
}
