import { Avatar, Badge, Box, Flex, Indicator, Text, useMantineColorScheme } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { FC, ReactNode } from 'react';

import { getLastMessageTime } from '@/shared/lib/getLastMessageTime';
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

    const data = {
        avatar: group.name[0]?.toUpperCase() as ReactNode,
        indicator: false,
        name: group.name,
        lastMessage: group.lastMessage?.text as ReactNode,
        lastMessageTime: group.lastMessage && getLastMessageTime(group.lastMessage.date),
        newMessages: userInfo?.newMessages[group._id] ? userInfo.newMessages[group._id] : undefined,
    };

    if (group.isDialog) {
        const user = userInfo?.users[group.users.find((id) => id !== userInfo.user._id) ?? ''];

        data.avatar = group.users.length === 1 ? <IconBookmark /> : user?.username[0]?.toUpperCase();
        data.indicator = user?.isOnline ?? false;
        data.name = user?.username ?? 'Saved messages';
    } else {
        data.lastMessage = (
            <>
                <Text component='span' c={!active ? 'blue' : undefined}>
                    {userInfo?.users[group.lastMessage?.author ?? '']?.username}:
                </Text>
                {' ' + group.lastMessage?.text}
            </>
        );
    }

    return (
        <Link className={styles.root} to={`${HOME_PATH}${group._id}`}>
            <Flex className={styles.wrapper} bg={active ? activeColor : undefined} p='xs' gap='xs'>
                <Indicator offset={7} position='bottom-end' color='blue.4' disabled={!data.indicator}>
                    <Avatar radius='xl' size='lg' color='blue'>
                        {data.avatar}
                    </Avatar>
                </Indicator>

                <Box w='100%' c={active ? 'white' : undefined}>
                    <Flex justify='space-between' gap='xs'>
                        <Text fw='500' truncate>
                            {data.name}
                        </Text>
                        <Text>{data.lastMessageTime}</Text>
                    </Flex>
                    <Flex align='center' justify='space-between'>
                        <Text truncate>{data.lastMessage}</Text>
                        {data.newMessages && (
                            <Badge px='6px' color='blue' variant='filled'>
                                {data.newMessages}
                            </Badge>
                        )}
                    </Flex>
                </Box>
            </Flex>
        </Link>
    );
};

export default GroupItem;
