import { FC, Suspense } from 'react';
import { Flex, Loader } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';

export const withRouter =
    (Component: FC): FC =>
    () =>
        (
            <BrowserRouter>
                <Suspense
                    fallback={
                        <Flex mih='100vh' align='center' justify='center'>
                            <Loader />
                        </Flex>
                    }>
                    <Component />
                </Suspense>
            </BrowserRouter>
        );
