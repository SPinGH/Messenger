import { Modal, NavLink, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { FC } from 'react';

import UsernameForm from './UsernameForm';
import ChangePasswordForm from './ChangePasswordForm';

const SettingsButton: FC = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <NavLink label='Settings' icon={<IconSettings size='1rem' />} px='md' onClick={open} />

            <Modal opened={opened} onClose={close} title='Settings'>
                <Stack>
                    <UsernameForm />
                    <ChangePasswordForm />
                </Stack>
            </Modal>
        </>
    );
};

export default SettingsButton;
