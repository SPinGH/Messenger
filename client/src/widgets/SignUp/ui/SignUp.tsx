import { Alert, Box, Button, Collapse, Flex, Paper, PasswordInput, TextInput } from '@mantine/core';
import { useForm, matchesField, hasLength } from '@mantine/form';
import { FC } from 'react';

import { getErrorMessage } from '@/shared/lib';
import { userApi } from '@/entities/User';
import { TokenStorage } from '@/shared/api';

const SignUp: FC = () => {
    const [signIn, { isLoading, error }] = userApi.useSignUpMutation();
    const { refetch } = userApi.useGetUserInfoQuery();

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: hasLength({ min: 6 }, 'Password should include at least 6 characters'),
            confirmPassword: matchesField('password', 'Passwords are not the same'),
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

                    <PasswordInput
                        label='Confirm password'
                        placeholder='••••••'
                        required
                        {...form.getInputProps('confirmPassword')}
                    />

                    <Box>
                        <Button type='submit' fullWidth mt='md' loading={isLoading}>
                            Sign up
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

export default SignUp;
