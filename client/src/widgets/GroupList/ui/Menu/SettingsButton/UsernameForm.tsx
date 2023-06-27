import { Button, Flex, TextInput } from '@mantine/core';
import { FC, useState, ChangeEvent, FormEvent } from 'react';

import { userApi } from '@/entities/User';

const UsernameForm: FC = () => {
    const { data } = userApi.useGetUserInfoQuery();
    const [updateUser, { isLoading }] = userApi.useUpdateUserMutation();
    const [username, setUsername] = useState(data?.username ?? '');

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setUsername(event.currentTarget.value);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        updateUser({ username });
    };

    return (
        <form onSubmit={onSubmit}>
            <Flex gap='xs' align='flex-end'>
                <TextInput
                    label='Username'
                    placeholder='username'
                    w='100%'
                    required
                    value={username}
                    onChange={onChange}
                />
                <Button variant='default' loading={isLoading} type='submit'>
                    Save
                </Button>
            </Flex>
        </form>
    );
};

export default UsernameForm;
