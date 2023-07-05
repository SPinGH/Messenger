import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { FC } from 'react';

import { getLastMessageTime } from '@/shared/lib/getLastMessageTime';
import { Group, GroupHeader } from '@/entities/Group';
import { userApi } from '@/entities/User';
import GroupMenu from './GroupMenu';
import GroupInfo from './GroupInfo';

interface ChatHeaderProps {
    group: Group;
}

const ChatHeader: FC<ChatHeaderProps> = ({ group }) => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const [opened, { open, close }] = useDisclosure(false);

    let name = 'Saved messages';
    let info = '';

    if (group.isDialog && group.users.length === 2) {
        const user = userInfo?.users[group.users.find((id) => id !== userInfo?.user._id) ?? ''];
        name = user?.username ?? group.name;
        info = user?.isOnline ? 'online' : `last seen in ${getLastMessageTime(user?.lastSeen ?? '')}`;
    } else if (!group.isDialog) {
        name = group.name;
        info = `${group.users.length} members`;
    }

    return (
        <GroupHeader
            title={name}
            subtitle={info}
            onClick={open}
            rightSection={
                <>
                    <GroupMenu group={group} openInfo={open} />

                    <Modal opened={opened} onClose={close} title={group.isDialog ? 'User info' : 'Group info'}>
                        <GroupInfo group={group} />
                    </Modal>
                </>
            }
        />
    );
};

export default ChatHeader;
