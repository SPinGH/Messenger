import { Avatar, Flex, Indicator, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { FC, HTMLAttributes } from 'react';

import { Group, GroupRequest } from '..';

interface GroupCardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    selected?: boolean;
    group: WithOptional<Group, '_id'> | GroupRequest;
}

const GroupCard: FC<GroupCardProps> = ({ className, group, selected, ...props }) => {
    return (
        <Flex className={className} p='xs' gap='xs' {...props}>
            <Indicator
                size={24}
                offset={7}
                position='bottom-end'
                color='blue.9'
                label={<IconCheck size='0.8rem' />}
                disabled={!selected}>
                <Avatar radius='xl' size='lg' color='blue'>
                    {group.name[0].toUpperCase()}
                </Avatar>
            </Indicator>

            <Flex w='100%' direction='column'>
                <Text fw='500' truncate>
                    {group.name}
                </Text>
                <Text size='sm'>{group.users.length} members</Text>
            </Flex>
        </Flex>
    );
};

export default GroupCard;
