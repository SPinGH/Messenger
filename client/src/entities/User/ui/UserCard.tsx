import { Avatar, Flex, Indicator, Stack, Text } from '@mantine/core';
import { FC, HTMLAttributes } from 'react';

import { User as UserType } from '..';
import { IconCheck } from '@tabler/icons-react';

interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    selected?: boolean;
    user: UserType;
}

const UserCard: FC<UserCardProps> = ({ className, user, selected, ...props }) => {
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
                    {user.username[0].toUpperCase()}
                </Avatar>
            </Indicator>

            <Stack w='100%'>
                <Text fw='500' truncate>
                    {user.username}
                </Text>
            </Stack>
        </Flex>
    );
};

export default UserCard;
