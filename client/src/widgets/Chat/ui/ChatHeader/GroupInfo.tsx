import { ActionIcon, Avatar, Badge, Box, Button, Flex, Text, TextInput } from '@mantine/core';
import { ChangeEvent, FC, useState } from 'react';
import { IconX } from '@tabler/icons-react';

import { Group, GroupCard, groupApi } from '@/entities/Group';
import { User, UserCard, userApi } from '@/entities/User';
import SearchUser from '@/features/SearchUser';

interface GroupInfoProps {
    group: Group;
}

const GroupInfo: FC<GroupInfoProps> = ({ group }) => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const [updateGroup, { isLoading }] = groupApi.useUpdateGroupMutation();
    const [name, setName] = useState(group.name);
    const [members, setMembers] = useState<User[]>(() => {
        const users = group.users.filter((id) => id !== userInfo?.user._id);
        return users.map((id) => userInfo?.users[id] as User);
    });

    if (group.isDialog) {
        const user = members.length === 0 ? userInfo!.user : members[0];
        return (
            <Flex>
                <UserCard user={user} />
            </Flex>
        );
    }

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);
    const onUserClick = (user: User) => {
        const candidate = members.find((u) => u._id === user._id);
        if (candidate) setMembers(members.filter((user) => user !== candidate));
        else setMembers([...members, user]);
    };

    const onSaveClick = () =>
        updateGroup({ _id: group._id!, name, isDialog: false, users: [...members, userInfo!.user] });

    return (
        <Flex direction='column' gap='xs'>
            <GroupCard group={group} />
            <TextInput
                label='Group name'
                variant='filled'
                placeholder='groupname'
                value={name}
                onChange={onNameChange}
            />
            <Box>
                <Text size='sm' fw='500' mb='4px'>
                    Members
                </Text>
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
            </Box>

            <SearchUser onClick={onUserClick} selected={members} />
            <Button variant='default' loading={isLoading} onClick={onSaveClick}>
                Save
            </Button>
        </Flex>
    );
};

export default GroupInfo;
