import { FC, FormEvent, useState, ChangeEvent } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, Flex, Input } from '@mantine/core';

import { Group, chatApi } from '@/entities/Chat';
import { useNavigate } from 'react-router-dom';
import { HOME_PATH } from '@/pages';

interface ChatFormProps {
    group: WithOptional<Group, '_id'>;
}

const ChatForm: FC<ChatFormProps> = ({ group }) => {
    const [sendMessage] = chatApi.useSendMessageMutation();
    const [createGroup] = chatApi.useCreateGroupMutation();
    const navigate = useNavigate();
    const [value, setValue] = useState('');

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (group._id) {
            sendMessage({ group: group._id, text: value });
            setValue('');
        } else {
            createGroup({ name: group.name, isDialog: true, users: group.users })
                .unwrap()
                .then(({ _id }) => {
                    sendMessage({ group: _id, text: value });
                    navigate(`${HOME_PATH}${_id}`);
                });
        }
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value);

    return (
        <form onSubmit={onSubmit}>
            <Flex gap='xs' py='xs' px='md'>
                <Input variant='unstyled' placeholder='Write a message...' value={value} onChange={onChange} w='100%' />
                <ActionIcon size='lg' aria-label='Send' type='submit'>
                    <IconChevronRight />
                </ActionIcon>
            </Flex>
        </form>
    );
};

export default ChatForm;
