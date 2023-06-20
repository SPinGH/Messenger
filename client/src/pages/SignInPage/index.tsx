import { Anchor, Container, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FC } from 'react';

import SignIn from '@/widgets/SignIn';
import { SIGNUP_PATH } from '..';

const LoginPage: FC = () => {
    return (
        <Container size={420} my={40}>
            <Title align='center'>Sign In</Title>
            <Text color='dimmed' size='sm' align='center' mt={5}>
                Do not have an account yet?{' '}
                <Anchor size='sm' component={Link} to={SIGNUP_PATH}>
                    Sign up
                </Anchor>
            </Text>

            <SignIn />
        </Container>
    );
};

export default LoginPage;
