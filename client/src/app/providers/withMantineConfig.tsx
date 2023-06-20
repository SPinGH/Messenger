import { MantineProvider } from '@mantine/core';
import { ComponentType } from 'react';

export const withMantineConfig =
    <T extends object>(Component: ComponentType<T>) =>
    (props: T) =>
        (
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <Component {...props} />
            </MantineProvider>
        );
