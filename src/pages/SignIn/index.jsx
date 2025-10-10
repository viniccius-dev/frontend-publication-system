import { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { Container, Form, Background } from './styles';

export function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();

    async function handleSignIn() {
        setLoading(true);
        await signIn({ email, password });
        setLoading(false);
    }

    return (
        <Container>
            <Form>
                <h2>Acesse sua conta</h2>

                <Input 
                    placeholder="E-mail"
                    type="email"
                    icon={FiMail}
                    onChange={e => setEmail(e.target.value)}
                />

                <Input 
                    placeholder="Senha"
                    type="password"
                    icon={FiLock}
                    onChange={e => setPassword(e.target.value)}
                />
                
                <Button title="Entrar" onClick={handleSignIn} loading={loading} />
            </Form>
            <Background />
        </Container>
        
    );
};