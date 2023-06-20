import { FC } from 'react';

import ErrorBoundary from '@/shared/ui/ErrorBoundary';

export const withErrorBoundary =
    (Component: FC): FC =>
    () =>
        (
            <ErrorBoundary>
                <Component />
            </ErrorBoundary>
        );
