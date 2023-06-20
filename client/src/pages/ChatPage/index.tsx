import { Box } from '@mantine/core';
import { FC } from 'react';

import styles from './ChatPage.module.css';
import GroupList from '@/widgets/GroupList';
import Chat from '@/widgets/Chat';

const ChatPage: FC = () => {
    return (
        <Box className={styles.root}>
            <Box className={styles.left}>
                <div className={styles.bar} />
                <Box className={styles.line} c='gray' />
                <Box className={styles.aside} p='sm'>
                    <GroupList />
                </Box>
            </Box>
            <Box className={styles.right} p='sm'>
                <Chat />
            </Box>
        </Box>
    );
};

export default ChatPage;
