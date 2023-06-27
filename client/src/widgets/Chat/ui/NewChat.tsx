import { Box, Flex, Loader, useMantineColorScheme } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { FC } from 'react';

import { Group } from '@/entities/Chat';
import { userApi } from '@/entities/User';
import ChatHeader from './ChatHeader';
import ChatForm from './ChatForm';

const NewChat: FC = () => {
    const { id } = useParams();
    const { data: currentUser } = userApi.useGetUserInfoQuery();
    const { data: user } = userApi.useGetUserQuery(id!);

    const { colorScheme } = useMantineColorScheme();
    const bgColor = colorScheme === 'dark' ? 'dark.9' : 'blue.0';

    if (!user || !currentUser)
        return (
            <Flex h='100%' align='center' justify='center' bg={bgColor}>
                <Loader />
            </Flex>
        );

    const group: WithOptional<Group, '_id'> = { name: user.username, isDialog: true, users: [currentUser] };
    if (currentUser._id !== user._id) {
        group.users.push(user);
    } else {
        group.name = 'Saved messages';
    }

    return (
        <Flex h='100%' direction='column'>
            <ChatHeader group={group} />
            <Box h='100%' bg={bgColor} />
            <ChatForm group={group} />
        </Flex>
    );
};

export default NewChat;
