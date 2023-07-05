import { FC, FormEvent, useState, ChangeEvent } from 'react';
import { IconChevronRight } from '@tabler/icons-react';
import { ActionIcon, Flex, Input } from '@mantine/core';

interface GroupFormProps {
    onSend: (message: string) => void;
}

const GroupForm: FC<GroupFormProps> = ({ onSend }) => {
    const [value, setValue] = useState('');
    const onChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.currentTarget.value);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSend(value);
        setValue('');
    };

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

export default GroupForm;
