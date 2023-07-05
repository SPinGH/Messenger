import { Box, Input, Loader, Stack } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { ChangeEvent, FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { User, UserCard, userApi } from '@/entities/User';
import { groupApi } from '@/entities/Group';
import { HOME_PATH } from '@/pages';

import styles from './SearchUser.module.css';

interface SearchUserProps {
    withLinks?: boolean;
    selected?: User[];
    onClick?: (user: User) => void;
}

const SearchUser: FC<SearchUserProps> = ({ withLinks, selected, onClick }) => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const { data: groups, isLoading } = groupApi.useGetGroupsQuery();

    const [search, setSearch] = useDebouncedState('', 300);
    const onChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.currentTarget.value);

    const {
        data: users,
        isLoading: usersIsLoading,
        isFetching: usersIsFetching,
    } = userApi.useGetUsersQuery({ username: search }, { skip: !search });

    const filteredGroups = useMemo(
        () =>
            groups
                ?.filter((group) => group.isDialog && group.name.includes(search))
                .map((group) => {
                    const id =
                        group.users.length === 1
                            ? group.users[0]
                            : group.users.find((id) => id !== userInfo?.user._id) ?? '';

                    return { path: `${HOME_PATH}${group._id}`, user: userInfo?.users[id] as User };
                }),
        [groups, search, userInfo]
    );

    const filteredUsers = useMemo(() => {
        const items = filteredGroups ?? [];
        users?.forEach((user) => {
            if (!items.find((item) => item.user._id === user._id)) {
                items.push({ path: `${HOME_PATH}new/${user._id}`, user });
            }
        });
        return items.filter((item) => item.user._id !== userInfo?.user._id);
    }, [userInfo, filteredGroups, users]);

    return (
        <Box>
            <Input w='100%' variant='filled' placeholder='Search' defaultValue={search} onChange={onChange} />
            <Stack pt='xs'>
                {filteredUsers?.map(({ path, user }) => {
                    const handleClick = () => onClick?.(user);
                    const isSelected = !!selected?.find((item) => item._id === user._id);

                    return withLinks ? (
                        <Link key={user._id} className={styles.root} to={path} onClick={handleClick}>
                            <UserCard className={styles.wrapper} user={user} selected={isSelected} />
                        </Link>
                    ) : (
                        <UserCard
                            key={user._id}
                            className={styles.wrapper}
                            user={user}
                            onClick={handleClick}
                            selected={isSelected}
                        />
                    );
                })}
            </Stack>
            {(isLoading || usersIsLoading || usersIsFetching) && <Loader />}
        </Box>
    );
};

export default SearchUser;
