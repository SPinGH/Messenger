import { Box, Flex, Text, UnstyledButton } from '@mantine/core';
import { FC, ReactNode } from 'react';

interface GroupHeaderProps {
    title: string;
    subtitle: string;
    onClick?: () => void;
    rightSection?: ReactNode;
}

const GroupHeader: FC<GroupHeaderProps> = ({ title, subtitle, onClick, rightSection }) => {
    const Component = onClick ? UnstyledButton : Box;

    return (
        <Flex h='65px' align='center' justify='space-between'>
            <Component w='100%' py='xs' px='md' onClick={onClick}>
                <Text fw='500' size='sm' truncate lh='18px'>
                    {title}
                </Text>
                {subtitle && (
                    <Text size='sm' c='gray.5' lh='18px'>
                        {subtitle}
                    </Text>
                )}
            </Component>
            {rightSection && (
                <Box py='xs' pr='md'>
                    {rightSection}
                </Box>
            )}
        </Flex>
    );
};

export default GroupHeader;
