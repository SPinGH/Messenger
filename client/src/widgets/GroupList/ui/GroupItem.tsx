import { Avatar, Box, Flex, Text, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FC, ReactNode } from 'react';

import { getLastMessageTime } from '@/shared/lib/getLastMessageTime';
import { Group } from '@/entities/Chat';
import { HOME_PATH } from '@/pages';

import styles from './GroupItem.module.css';
import { IconBookmark } from '@tabler/icons-react';

interface GroupItemProps {
    active: boolean;
    group: Group;
}

const GroupItem: FC<GroupItemProps> = ({ group, active }) => {
    const { colorScheme } = useMantineColorScheme();
    const activeColor = colorScheme === 'dark' ? 'blue.9' : 'blue.6';

    let message: ReactNode = group.lastMessage?.text ?? '';
    if (!group.isDialog && group.lastMessage) {
        const username = group.users.find((u) => u._id === group.lastMessage?.author)?.username;
        message = (
            <>
                <Text component='span' c={!active ? 'blue' : undefined}>
                    {username}:
                </Text>
                {' ' + group.lastMessage?.text}
            </>
        );
    }

    return (
        <Link className={styles.root} to={`${HOME_PATH}${group._id}`}>
            <Flex className={styles.wrapper} bg={active ? activeColor : undefined} p='xs' gap='xs'>
                <Avatar radius='xl' size='lg' color='blue'>
                    {group.users.length === 1 ? <IconBookmark /> : group.name[0].toUpperCase()}
                </Avatar>
                <Box w='100%' c={active ? 'white' : undefined}>
                    <Flex justify='space-between' gap='xs'>
                        <Text fw='500' truncate>
                            {group.name}
                        </Text>
                        {group.lastMessage && <Text>{getLastMessageTime(group.lastMessage.date)}</Text>}
                    </Flex>
                    {message}
                </Box>
            </Flex>
        </Link>
    );
};

export default GroupItem;
