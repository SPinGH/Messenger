import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

import AuthRoute from '@/features/AuthRoute';

const SignInPage = lazy(() => import('./SignInPage'));
const SignUpPage = lazy(() => import('./SignUpPage'));

const ChatPage = lazy(() => import('./ChatPage'));
const Chat = lazy(() => import('@/widgets/Chat'));
const NewChat = lazy(() => import('@/widgets/NewChat'));

export const HOME_PATH = '/';
export const SIGNIN_PATH = '/signin';
export const SIGNUP_PATH = '/signup';

export const routes: RouteObject[] = [
    {
        path: HOME_PATH,
        element: <AuthRoute redirectTo={SIGNIN_PATH} />,
        children: [
            {
                path: HOME_PATH,
                element: <ChatPage />,
                children: [
                    {
                        path: HOME_PATH + ':id?',
                        element: <Chat />,
                    },
                    {
                        path: HOME_PATH + 'new/:id',
                        element: <NewChat />,
                    },
                ],
            },
        ],
    },
    {
        path: HOME_PATH,
        element: <AuthRoute reverseProtection />,
        children: [
            {
                path: SIGNIN_PATH,
                element: <SignInPage />,
            },
            {
                path: SIGNUP_PATH,
                element: <SignUpPage />,
            },
        ],
    },
];
