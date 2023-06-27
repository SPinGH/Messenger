import { Modal, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUser } from '@tabler/icons-react';
import { FC } from 'react';

import SearchUser from '@/features/SearchUser';

const ContactsButton: FC = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <NavLink label='Contacts' icon={<IconUser size='1rem' />} px='md' onClick={open} />

            <Modal opened={opened} onClose={close} title='Contacts'>
                <SearchUser withLinks onClick={close} />
            </Modal>
        </>
    );
};

export default ContactsButton;
