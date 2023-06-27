import { Box, Flex, Input, Loader } from '@mantine/core';
import { ChangeEvent, FC, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { chatApi } from '@/entities/Chat';
import GroupItem from './GroupItem';
import Menu from './Menu/Menu';

const GroupList: FC = () => {
    const { id } = useParams();
    const [search, setSearch] = useState('');
    const { data: groups, isLoading } = chatApi.useGetGroupsQuery();
    const filteredGroups = useMemo(() => groups?.filter((group) => group.name.includes(search)), [groups, search]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.currentTarget.value);

    return (
        <Box>
            <Flex align='center' p='xs' gap='xs'>
                <Menu />
                <Input w='100%' variant='filled' placeholder='Search' value={search} onChange={onChange} />
            </Flex>
            <Flex direction='column'>
                {isLoading && <Loader />}
                {filteredGroups?.map((group) => (
                    <GroupItem key={group._id} group={group} active={id === group._id} />
                ))}
            </Flex>
        </Box>
    );
};

export default GroupList;
