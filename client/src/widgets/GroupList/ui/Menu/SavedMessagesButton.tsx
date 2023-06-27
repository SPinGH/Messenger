import { chatApi } from '@/entities/Chat';
import { userApi } from '@/entities/User';
import { HOME_PATH } from '@/pages';
import { NavLink } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const SavedMessagesButton: FC = () => {
    const { data: currentUser } = userApi.useGetUserInfoQuery();
    const { data: groups } = chatApi.useGetGroupsQuery();

    const group = groups?.find((g) => g.name === 'Saved messages');
    const to = group ? `${HOME_PATH}${group._id}` : `${HOME_PATH}new/${currentUser?._id}`;

    return (
        <>
            <NavLink label='Saved messages' icon={<IconBookmark size='1rem' />} px='md' component={Link} to={to} />
        </>
    );
};

export default SavedMessagesButton;
