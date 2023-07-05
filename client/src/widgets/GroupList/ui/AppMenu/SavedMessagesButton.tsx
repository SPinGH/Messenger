import { groupApi } from '@/entities/Group';
import { userApi } from '@/entities/User';
import { HOME_PATH } from '@/pages';
import { NavLink } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const SavedMessagesButton: FC = () => {
    const { data: userInfo } = userApi.useGetUserInfoQuery();
    const { data: groups } = groupApi.useGetGroupsQuery();

    const group = groups?.find((group) => group.users.length === 1);
    const to = group ? `${HOME_PATH}${group._id}` : `${HOME_PATH}new/${userInfo?.user._id}`;

    return <NavLink label='Saved messages' icon={<IconBookmark size='1rem' />} px='md' component={Link} to={to} />;
};

export default SavedMessagesButton;
