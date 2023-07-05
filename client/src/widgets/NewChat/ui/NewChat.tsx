import { Box, Flex, Loader, useMantineColorScheme } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { FC } from 'react';

import { getLastMessageTime } from '@/shared/lib/getLastMessageTime';
import { GroupHeader, GroupForm, groupApi } from '@/entities/Group';
import { userApi } from '@/entities/User';
import { HOME_PATH } from '@/pages';

const NewChat: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: user } = userApi.useGetUserQuery(id!);
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const [createGroup] = groupApi.useCreateGroupMutation();
    const [sendMessage] = groupApi.useSendMessageMutation();

    const { colorScheme } = useMantineColorScheme();
    const bgColor = colorScheme === 'dark' ? 'dark.9' : 'blue.0';

    if (!user || !userInfo)
        return (
            <Flex h='100%' align='center' justify='center' bg={bgColor}>
                <Loader />
            </Flex>
        );

    const group = { name: user.username, isDialog: true, users: [userInfo.user] };
    if (userInfo.user._id !== user._id) {
        group.users.push(user);
    } else {
        group.name = 'Saved messages';
    }

    const onSend = (message: string) => {
        createGroup({
            name: user.username,
            isDialog: true,
            users: user._id === userInfo.user._id ? [userInfo.user] : [userInfo.user, user],
        })
            .unwrap()
            .then(({ _id }) => {
                sendMessage({ group: _id, text: message });
                navigate(`${HOME_PATH}${_id}`);
            });
    };

    return (
        <Flex h='100%' direction='column'>
            <GroupHeader
                title={user.username}
                subtitle={user.isOnline ? 'online' : `last seen in ${getLastMessageTime(user.lastSeen)}`}
            />
            <Box h='100%' bg={bgColor} />
            <GroupForm onSend={onSend} />
        </Flex>
    );
};

export default NewChat;
