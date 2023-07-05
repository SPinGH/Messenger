import { Box, Flex, Input, Loader } from '@mantine/core';
import { ChangeEvent, FC, useState } from 'react';
import { useParams } from 'react-router-dom';

import { groupApi } from '@/entities/Group';
import AppMenu from './AppMenu/AppMenu';
import GroupItem from './GroupItem';

const GroupList: FC = () => {
    const { id } = useParams();
    const { data: groups, isLoading } = groupApi.useGetGroupsQuery();

    const [search, setSearch] = useState('');
    const onChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.currentTarget.value);

    const filteredGroups = groups?.filter((group) => group.name.includes(search));

    return (
        <Box>
            <Flex align='center' p='xs' gap='xs'>
                <AppMenu />
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
