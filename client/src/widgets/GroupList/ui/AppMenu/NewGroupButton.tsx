import { ActionIcon, Avatar, Badge, Button, Flex, Input, Modal, NavLink } from '@mantine/core';
import { IconUsers, IconX } from '@tabler/icons-react';
import { ChangeEvent, FC, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

import { User, userApi } from '@/entities/User';
import SearchUser from '@/features/SearchUser';
import { groupApi } from '@/entities/Group';
import { HOME_PATH } from '@/pages';

const NewGroupButton: FC = () => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const [createGroup, { isLoading: createIsLoading }] = groupApi.useCreateGroupMutation();
    const navigate = useNavigate();

    const [opened, { open, close }] = useDisclosure(false);

    const [name, setName] = useState('');
    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);

    const [members, setMembers] = useState<User[]>([]);
    const deleteMember = (member: User) => () => setMembers((prev) => prev.filter((user) => user !== member));
    const toggleUser = (user: User) => {
        const candidate = members.find((u) => u._id === user._id);
        if (candidate) setMembers(members.filter((user) => user !== candidate));
        else setMembers([...members, user]);
    };

    const onCreateClick = () => {
        if (!userInfo) return;
        createGroup({ name, isDialog: false, users: [...members, userInfo.user] })
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
                                    {userInfo?.user.username[0].toUpperCase()}
                                </Avatar>
                            }>
                            {userInfo?.user.username}
                        </Badge>
                        {members.map((member) => (
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
                                    <ActionIcon
                                        size='xs'
                                        radius='xl'
                                        variant='transparent'
                                        onClick={deleteMember(member)}>
                                        <IconX size='0.8rem' />
                                    </ActionIcon>
                                }>
                                {member.username}
                            </Badge>
                        ))}
                    </Flex>
                    <SearchUser onClick={toggleUser} selected={members} />

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
