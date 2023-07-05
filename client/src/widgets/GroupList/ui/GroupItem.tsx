import { Avatar, Box, Flex, Indicator, Text, useMantineColorScheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FC } from 'react';

import { getLastMessageTime } from '@/shared/lib/getLastMessageTime';
import { IconBookmark } from '@tabler/icons-react';
import { userApi } from '@/entities/User';
import { Group } from '@/entities/Group';
import { HOME_PATH } from '@/pages';

import styles from './GroupItem.module.css';

interface GroupItemProps {
    active: boolean;
    group: Group;
}

const GroupItem: FC<GroupItemProps> = ({ group, active }) => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();

    const { colorScheme } = useMantineColorScheme();
    const activeColor = colorScheme === 'dark' ? 'blue.9' : 'blue.6';

    if (group.isDialog) {
        const user = userInfo?.users[group.users.find((id) => id !== userInfo.user._id) ?? ''];

        return (
            <Link className={styles.root} to={`${HOME_PATH}${group._id}`}>
                <Flex className={styles.wrapper} bg={active ? activeColor : undefined} p='xs' gap='xs'>
                    <Indicator offset={7} position='bottom-end' color='blue.4' disabled={!user?.isOnline}>
                        <Avatar radius='xl' size='lg' color='blue'>
                            {group.users.length === 1 ? <IconBookmark /> : user?.username[0]?.toUpperCase()}
                        </Avatar>
                    </Indicator>

                    <Box w='100%' c={active ? 'white' : undefined}>
                        <Flex justify='space-between' gap='xs'>
                            <Text fw='500' truncate>
                                {user?.username ?? 'Saved messages'}
                            </Text>
                            {group.lastMessage && <Text>{getLastMessageTime(group.lastMessage.date)}</Text>}
                        </Flex>
                        {group.lastMessage?.text}
                    </Box>
                </Flex>
            </Link>
        );
    }
    const username = userInfo?.users[group.lastMessage?.author ?? '']?.username;

    return (
        <Link className={styles.root} to={`${HOME_PATH}${group._id}`}>
            <Flex className={styles.wrapper} bg={active ? activeColor : undefined} p='xs' gap='xs'>
                <Avatar radius='xl' size='lg' color='blue'>
                    {group.users.length === 1 ? <IconBookmark /> : group.name[0]?.toUpperCase()}
                </Avatar>

                <Box w='100%' c={active ? 'white' : undefined}>
                    <Flex justify='space-between' gap='xs'>
                        <Text fw='500' truncate>
                            {group.name}
                        </Text>
                        {group.lastMessage && <Text>{getLastMessageTime(group.lastMessage.date)}</Text>}
                    </Flex>
                    <Text component='span' c={!active ? 'blue' : undefined}>
                        {username}:
                    </Text>
                    {' ' + group.lastMessage?.text}
                </Box>
            </Flex>
        </Link>
    );
};

export default GroupItem;
