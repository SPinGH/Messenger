import { FC } from 'react';

import { groupApi, Group, GroupForm } from '@/entities/Group';

interface ChatFormProps {
    group: Group;
}

const ChatForm: FC<ChatFormProps> = ({ group }) => {
    const [sendMessage] = groupApi.useSendMessageMutation();
    const onSend = (message: string) => sendMessage({ group: group._id, text: message });

    return <GroupForm onSend={onSend} />;
};

export default ChatForm;
