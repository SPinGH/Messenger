import { Avatar, Flex, Paper, useMantineColorScheme } from '@mantine/core';
import { FC, useMemo } from 'react';

import { Group, chatApi } from '@/entities/Chat';
import { User, userApi } from '@/entities/User';

import styles from './ChatBody.module.css';

interface ChatBodyProps {
    group: Group;
    bg: string;
}

const ChatBody: FC<ChatBodyProps> = ({ group, bg }) => {
    const { data: user } = userApi.useGetUserInfoQuery();
    const { data: messages } = chatApi.useGetMessagesQuery(group._id);

    const { colorScheme } = useMantineColorScheme();
    const isDarkTheme = colorScheme === 'dark';
    const authorMessageColor = isDarkTheme ? 'blue.9' : 'blue.2';
    const userMessageColor = isDarkTheme ? 'gray.9' : 'gray.3';

    const usersMap = useMemo(
        () =>
            group.users.reduce((acc, user) => {
                acc[user._id] = user;
                return acc;
            }, {} as Record<string, User>),
        [group]
    );

    return (
        <Flex className={styles.messages} direction='column' h='100%' gap='xs' py='xs' px='md' bg={bg}>
            {messages?.map((message) => (
                <Flex key={message._id} gap='xs'>
                    <Avatar radius='xl'>{usersMap[message.author].username[0].toUpperCase()}</Avatar>
                    <Paper
                        py='4px'
                        px='12px'
                        bg={user?._id === message.author ? authorMessageColor : userMessageColor}
                        radius='xl'
                        w='fit-content'>
                        {message.text}
                    </Paper>
                </Flex>
            ))}
        </Flex>
    );
};

export default ChatBody;
