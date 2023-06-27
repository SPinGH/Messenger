import { Group } from '@/entities/Chat';
import { ActionIcon, Box, Flex, Text } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { FC } from 'react';

interface ChatHeaderProps {
    group: WithOptional<Group, '_id'>;
}

const ChatHeader: FC<ChatHeaderProps> = ({ group }) => {
    return (
        <Flex h='65px' align='center' justify='space-between' py='xs' px='md'>
            <Box>
                <Text fw='500' size='sm' truncate lh='18px'>
                    {group.name}
                </Text>
                {group.users.length > 1 && (
                    <Text size='sm' c='gray.5' lh='18px'>
                        {group.users.length} members
                    </Text>
                )}
            </Box>
            <ActionIcon size='lg' aria-label='More actions' type='submit'>
                <IconDotsVertical />
            </ActionIcon>
        </Flex>
    );
};

export default ChatHeader;
