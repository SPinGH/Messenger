import { chatApi } from '@/entities/Chat';
import { userApi } from '@/entities/User';
import { Avatar, Box, Button, Flex, Input, Paper, Stack } from '@mantine/core';
import { FC, FormEvent, useRef } from 'react';

const Chat: FC = () => {
    const { data: user } = userApi.useGetUserInfoQuery();
    const { data: messages } = chatApi.useGetMessagesQuery();
    const [sendMessage] = chatApi.useSendMessageMutation();
    const inputRef = useRef<HTMLInputElement>(null);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (inputRef.current) {
            sendMessage(inputRef.current.value);
            inputRef.current.value = '';
        }
    };
    return (
        <Flex h='100%' direction='column' gap='xs'>
            <Flex direction='column' h='100%' gap='xs' style={{ overflow: 'auto' }}>
                {messages?.map((message) => (
                    <Flex key={message._id} gap='xs'>
                        <Avatar radius='xl' color='#468faf'>
                            {message.text[0].toUpperCase()}
                        </Avatar>
                        <Paper
                            py='4px'
                            px='12px'
                            bg={user?._id === message.author ? '#a4cff5' : '#cbe4f9'}
                            radius='xl'
                            w='fit-content'>
                            {message.text}
                        </Paper>
                    </Flex>
                ))}
            </Flex>
            <form onSubmit={onSubmit}>
                <Flex>
                    <Input ref={inputRef} w='100%' />
                    <Button type='submit' variant='outline'>
                        {'>'}
                    </Button>
                </Flex>
            </form>
        </Flex>
    );
};

export default Chat;
