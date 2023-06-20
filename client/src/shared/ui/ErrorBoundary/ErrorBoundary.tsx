import { Component, ReactNode } from 'react';

export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
    };

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public componentDidCatch() {
        // TODO
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback ? this.props.fallback : <div>Error</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
