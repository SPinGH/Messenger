import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ComponentType } from 'react';

export const withMantineConfig =
    <T extends object>(Component: ComponentType<T>) =>
    (props: T) => {
        const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
            key: 'mantine-color-scheme',
            defaultValue: 'light',
            getInitialValueInEffect: true,
        });
        const toggleColorScheme = (value?: ColorScheme) =>
            setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

        return (
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        primaryColor: colorScheme === 'dark' ? 'gray' : 'dark',
                        colorScheme: colorScheme,
                    }}>
                    <Component {...props} />
                </MantineProvider>
            </ColorSchemeProvider>
        );
    };
