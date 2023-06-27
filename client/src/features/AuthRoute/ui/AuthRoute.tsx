import { FC } from 'react';
import { Flex, Loader } from '@mantine/core';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { userApi } from '@/entities/User';

import { HOME_PATH } from '@/pages';

interface AuthRouteProps {
    redirectTo?: string;
    reverseProtection?: boolean;
}

const AuthRoute: FC<AuthRouteProps> = ({ redirectTo, reverseProtection }) => {
    const { data, isLoading } = userApi.useGetUserInfoQuery();
    const location = useLocation();

    if (isLoading) {
        return (
            <Flex mih='100vh' align='center' justify='center'>
                <Loader />
            </Flex>
        );
    }

    const redirect = redirectTo ?? (location.state as { from: Location })?.from ?? HOME_PATH;

    return !data !== !reverseProtection ? <Outlet /> : <Navigate to={redirect} replace state={{ from: location }} />;
};

export default AuthRoute;
