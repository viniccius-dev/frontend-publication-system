import { MoonLoader } from 'react-spinners';
import { Container } from './styles';

export function LoadingSpinner({ loading, ...rest }) {
    return (
        <Container {...rest}>
            <MoonLoader loading={loading} size={50} />
        </Container>
    );
}