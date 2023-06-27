import { Outlet } from 'react-router-dom';
import { Box } from '@mantine/core';
import { FC } from 'react';

import styles from './ChatPage.module.css';
import GroupList from '@/widgets/GroupList';

const ChatPage: FC = () => {
    return (
        <Box className={styles.root}>
            <Box className={styles.left}>
                <div className={styles.bar} />
                <Box className={styles.line} />
                <Box className={styles.aside}>
                    <GroupList />
                </Box>
            </Box>
            <Box className={styles.right}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default ChatPage;
