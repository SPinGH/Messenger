import { Alert, Box, Button, Collapse, Flex, Paper, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FC } from 'react';

import { getErrorMessage } from '@/shared/lib';
import { userApi } from '@/entities/User';
import { TokenStorage } from '@/shared/api';

const SignIn: FC = () => {
    const [signIn, { isLoading, error }] = userApi.useSignInMutation();
    const { refetch } = userApi.useGetUserInfoQuery();

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit: Parameters<(typeof form)['onSubmit']>[0] = (values) => {
        signIn(values)
            .unwrap()
            .then((data) => {
                TokenStorage.set(data.token);
                refetch();
            });
    };

    return (
        <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Flex direction='column' gap='md'>
                    <TextInput label='Username' placeholder='username' required {...form.getInputProps('username')} />

                    <PasswordInput label='Password' placeholder='••••••' required {...form.getInputProps('password')} />

                    <Box>
                        <Button type='submit' fullWidth loading={isLoading}>
                            Sign in
                        </Button>
                        <Collapse in={!!error}>
                            <Alert color='red' p='xs' mt='xs'>
                                {getErrorMessage(error)}
                            </Alert>
                        </Collapse>
                    </Box>
                </Flex>
            </form>
        </Paper>
    );
};

export default SignIn;
