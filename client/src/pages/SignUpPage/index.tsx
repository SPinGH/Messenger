import { FC } from 'react';
import { Anchor, Container, Text, Title } from '@mantine/core';
import SignUp from '@/widgets/SignUp';
import { SIGNIN_PATH } from '..';
import { Link } from 'react-router-dom';

const SigninPage: FC = () => {
    return (
        <Container size={420} my={40}>
            <Title align='center'>Sign Up</Title>
            <Text color='dimmed' size='sm' align='center' mt={5}>
                Do you have an account?{' '}
                <Anchor size='sm' component={Link} to={SIGNIN_PATH}>
                    Sign in
                </Anchor>
            </Text>

            <SignUp />
        </Container>
    );
};

export default SigninPage;
