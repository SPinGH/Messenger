import { Avatar, Flex, Paper, useMantineColorScheme } from '@mantine/core';
import { FC, memo } from 'react';

import { Group, groupApi } from '@/entities/Group';
import { userApi } from '@/entities/User';

import styles from './ChatBody.module.css';

interface ChatBodyProps {
    groupId: Group['_id'];
    bg: string;
}

const ChatBody: FC<ChatBodyProps> = memo(({ groupId, bg }) => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const { data: messages } = groupApi.useGetMessagesQuery(groupId);

    const { colorScheme } = useMantineColorScheme();
    const isDarkTheme = colorScheme === 'dark';
    const authorMessageColor = isDarkTheme ? 'blue.9' : 'blue.2';
    const userMessageColor = isDarkTheme ? 'gray.9' : 'gray.3';

    return (
        <Flex className={styles.messages} direction='column' h='100%' gap='xs' py='xs' px='md' bg={bg}>
            {messages?.map((message) => (
                <Flex key={message._id} gap='xs'>
                    <Avatar radius='xl'>{userInfo?.users[message.author]?.username[0].toUpperCase()}</Avatar>
                    <Paper
                        py='4px'
                        px='12px'
                        bg={userInfo?.user._id === message.author ? authorMessageColor : userMessageColor}
                        radius='xl'
                        w='fit-content'>
                        {message.text}
                    </Paper>
                </Flex>
            ))}
        </Flex>
    );
});

export default ChatBody;
