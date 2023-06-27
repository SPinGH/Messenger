import { ActionIcon, Avatar, Badge, Button, Flex, Input, Modal, NavLink } from '@mantine/core';
import { IconUsers, IconX } from '@tabler/icons-react';
import { ChangeEvent, FC, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

import { User, userApi } from '@/entities/User';
import SearchUser from '@/features/SearchUser';
import { chatApi } from '@/entities/Chat';
import { HOME_PATH } from '@/pages';

const NewGroupButton: FC = () => {
    const { data: curentUser } = userApi.useGetUserInfoQuery();
    const [createGroup, { isLoading: createIsLoading }] = chatApi.useCreateGroupMutation();
    const navigate = useNavigate();

    const [opened, { open, close }] = useDisclosure(false);

    const [name, setName] = useState('');
    const [members, setMembers] = useState<User[]>([]);

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);
    const onUserClick = (user: User) => {
        const candidate = members.find((u) => u._id === user._id);
        if (candidate) setMembers(members.filter((user) => user !== candidate));
        else setMembers([...members, user]);
    };

    const onCreateClick = () => {
        createGroup({ name, isDialog: false, users: [...members, curentUser!] })
            .unwrap()
            .then(({ _id }) => {
                close();
                navigate(`${HOME_PATH}${_id}`);
            });
    };

    return (
        <>
            <NavLink label='New group' icon={<IconUsers size='1rem' />} px='md' onClick={open} />

            <Modal opened={opened} onClose={close} title='New group'>
                <Flex direction='column' gap='md'>
                    <Input w='100%' variant='filled' placeholder='groupname' value={name} onChange={onNameChange} />
                    <Flex gap='xs'>
                        <Badge
                            pl={0}
                            size='lg'
                            radius='xl'
                            leftSection={
                                <Avatar size='sm' color='blue' radius='xl'>
                                    {curentUser?.username[0].toUpperCase()}
                                </Avatar>
                            }>
                            {curentUser?.username}
                        </Badge>
                        {members.map((member) => {
                            const onClick = () => setMembers((prev) => prev.filter((user) => user !== member));
                            return (
                                <Badge
                                    key={member._id}
                                    pl={0}
                                    size='lg'
                                    radius='xl'
                                    leftSection={
                                        <Avatar size='sm' color='blue' radius='xl'>
                                            {member.username[0].toUpperCase()}
                                        </Avatar>
                                    }
                                    rightSection={
                                        <ActionIcon size='xs' radius='xl' variant='transparent' onClick={onClick}>
                                            <IconX size='0.8rem' />
                                        </ActionIcon>
                                    }>
                                    {member.username}
                                </Badge>
                            );
                        })}
                    </Flex>
                    <SearchUser onClick={onUserClick} selected={members} />
                    <Flex gap='xs' justify='flex-end'>
                        <Button variant='default' onClick={close}>
                            Cancel
                        </Button>
                        <Button variant='default' loading={createIsLoading} onClick={onCreateClick}>
                            Create
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
        </>
    );
};

export default NewGroupButton;
