import { ActionIcon, Avatar, Box, Divider, Drawer, NavLink, Text, useMantineColorScheme } from '@mantine/core';
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { FC } from 'react';

import { userApi } from '@/entities/User';
import ContactsButton from './ContactsButton';
import NewGroupButton from './NewGroupButton';
import SavedMessagesButton from './SavedMessagesButton';
import SettingsButton from './SettingsButton';

const Menu: FC = () => {
    const { data: user } = userApi.useGetUserInfoQuery();
    const [opened, { open, close }] = useDisclosure(false);

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isDarkTheme = colorScheme === 'dark';

    const toggleTheme = () => toggleColorScheme();

    return (
        <>
            <ActionIcon onClick={open} size='lg' aria-label='Menu'>
                <IconMenu2 />
            </ActionIcon>

            <Drawer.Root opened={opened} onClose={close} size='xs' keepMounted>
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Body p='0'>
                        <Box p='md'>
                            <Avatar radius='xl' size='lg' color='blue' mb='xs'>
                                {user?.username[0].toUpperCase()}
                            </Avatar>
                            <Text>{user?.username}</Text>
                        </Box>
                        <Divider />
                        <Box pt='xs' onClick={close}>
                            <NewGroupButton />
                            <ContactsButton />
                            <SavedMessagesButton />
                            <SettingsButton />
                        </Box>
                        <NavLink
                            label={isDarkTheme ? 'Light mode' : 'Dark mode'}
                            icon={isDarkTheme ? <IconSun size='1rem' /> : <IconMoon size='1rem' />}
                            px='md'
                            onClick={toggleTheme}
                        />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        </>
    );
};

export default Menu;
