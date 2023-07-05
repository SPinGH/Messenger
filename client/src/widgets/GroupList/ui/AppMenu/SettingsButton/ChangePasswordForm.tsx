import { Button, Flex, PasswordInput } from '@mantine/core';
import { FC } from 'react';

import { userApi } from '@/entities/User';
import { hasLength, matchesField, useForm } from '@mantine/form';

const ChangePasswordForm: FC = () => {
    const [changePassword, { isLoading }] = userApi.useChangePasswordMutation();
    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: {
            newPassword: hasLength({ min: 6 }, 'Password should include at least 6 characters'),
            confirmPassword: matchesField('newPassword', 'Passwords are not the same'),
        },
    });

    const onSubmit: Parameters<(typeof form)['onSubmit']>[0] = (values) => changePassword(values);

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Flex gap='xs' direction='column'>
                <PasswordInput
                    label='Old password'
                    placeholder='••••••'
                    required
                    {...form.getInputProps('oldPassword')}
                />
                <PasswordInput
                    label='New password'
                    placeholder='••••••'
                    required
                    {...form.getInputProps('newPassword')}
                />
                <PasswordInput
                    label='Confirm password'
                    placeholder='••••••'
                    required
                    {...form.getInputProps('confirmPassword')}
                />
                <Button variant='default' loading={isLoading} type='submit' mt='xs'>
                    Save
                </Button>
            </Flex>
        </form>
    );
};

export default ChangePasswordForm;
