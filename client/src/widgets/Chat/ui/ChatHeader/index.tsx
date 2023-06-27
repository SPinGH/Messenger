import { Box, Flex, Modal, Text, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FC } from 'react';

import { Group } from '@/entities/Chat';
import GroupMenu from './GroupMenu';
import GroupInfo from './GroupInfo';

interface ChatHeaderProps {
    group: WithOptional<Group, '_id'>;
}

const ChatHeader: FC<ChatHeaderProps> = ({ group }) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Flex h='65px' align='center' justify='space-between' py='xs' px='md'>
            <UnstyledButton onClick={open}>
                <Text fw='500' size='sm' truncate lh='18px'>
                    {group.name}
                </Text>
                {group.users.length > 1 && (
                    <Text size='sm' c='gray.5' lh='18px'>
                        {group.users.length} members
                    </Text>
                )}
            </UnstyledButton>
            {group._id && <GroupMenu group={group as Group} openInfo={open} />}

            <Modal opened={opened} onClose={close} title={group.isDialog ? 'User info' : 'Group info'}>
                <GroupInfo group={group} />
            </Modal>
        </Flex>
    );
};

export default ChatHeader;
