import { Flex, useMantineColorScheme } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { FC } from 'react';

import { chatApi } from '@/entities/Chat';
import ChatForm from './ChatForm';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';

const Chat: FC = () => {
    const { id } = useParams();
    const { data: groups } = chatApi.useGetGroupsQuery();

    const { colorScheme } = useMantineColorScheme();
    const bgColor = colorScheme === 'dark' ? 'dark.9' : 'blue.0';

    const group = groups?.find((group) => group._id === id);

    if (!id || !group)
        return (
            <Flex h='100%' align='center' justify='center' bg={bgColor}>
                Select a group to start messaging
            </Flex>
        );

    return (
        <Flex h='100%' direction='column'>
            <ChatHeader group={group} />
            <ChatBody key={id} group={group} bg={bgColor} />
            <ChatForm group={group} />
        </Flex>
    );
};

export default Chat;
