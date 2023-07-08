import { userApi } from '@/entities/User';
import { TokenStorage, commonApi } from '@/shared/api';
import { useAppDispatch } from '@/shared/lib';
import { Button } from '@mantine/core';
import { FC } from 'react';

const LogOutButton: FC = () => {
    const dispatch = useAppDispatch();

    const onClick = () => {
        TokenStorage.clear();
        dispatch(userApi.endpoints.getUserInfo.initiate());
        dispatch(commonApi.util.resetApiState());
    };

    return (
        <Button variant='outline' color='red' onClick={onClick}>
            Log out
        </Button>
    );
};

export default LogOutButton;
