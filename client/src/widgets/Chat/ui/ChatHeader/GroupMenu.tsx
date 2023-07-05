import { IconDotsVertical, IconInfoCircle, IconTrash, IconUserCircle } from '@tabler/icons-react';
import { ActionIcon, Button, Flex, Menu, Modal, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { FC } from 'react';

import { Group, groupApi } from '@/entities/Group';
import { HOME_PATH } from '@/pages';

interface GroupMenuProps {
    group: Group;
    openInfo: () => void;
}

const GroupMenu: FC<GroupMenuProps> = ({ group, openInfo }) => {
    const [deleteGroup, { isLoading }] = groupApi.useDeleteGroupMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();

    const onDeleteClick = () =>
        deleteGroup({ _id: group._id })
            .unwrap()
            .then(() => {
                navigate(HOME_PATH);
            });

    return (
        <Menu shadow='md' width={200} keepMounted>
            <Menu.Target>
                <ActionIcon size='lg' aria-label='More actions' type='submit'>
                    <IconDotsVertical />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    icon={group.isDialog ? <IconUserCircle size='1rem' /> : <IconInfoCircle size='1rem' />}
                    onClick={openInfo}>
                    {`View ${group.isDialog ? 'profile' : 'group info'}`}
                </Menu.Item>
                <Menu.Item color='red' icon={<IconTrash size='1rem' />} onClick={open}>
                    {`Delete ${group.isDialog ? 'chat' : 'group'}`}
                </Menu.Item>
            </Menu.Dropdown>
            <Modal centered size='xs' opened={opened} onClose={close}>
                <Text ta='center'>Are you sure you want to delete all message history "{group.name}"</Text>
                <Flex justify='flex-end' gap='xs' mt='md'>
                    <Button variant='default' onClick={close}>
                        Cancel
                    </Button>
                    <Button color='red' variant='outline' onClick={onDeleteClick} loading={isLoading}>
                        Delete
                    </Button>
                </Flex>
            </Modal>
        </Menu>
    );
};

export default GroupMenu;
