import AuthRoute from '@/features/AuthRoute';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LoginPage = lazy(() => import('./LoginPage'));

export const HOME_PATH = '/';
export const LOGIN_PATH = '/login';

export const routes: RouteObject[] = [
    {
        path: HOME_PATH,
        element: <AuthRoute redirectTo={LOGIN_PATH} />,
        children: [
            {
                path: HOME_PATH,
                element: <div>Home</div>,
            },
        ],
    },
    {
        path: HOME_PATH,
        element: <AuthRoute reverseProtection />,
        children: [
            {
                path: LOGIN_PATH,
                element: <LoginPage />,
            },
        ],
    },
];
