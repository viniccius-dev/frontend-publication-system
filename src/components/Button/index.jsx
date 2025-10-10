import { Container } from './styles';

export function Button({ title, loading = false, background = "default", icon: Icon, ...rest }) {
    return (
        <Container
            type="button"
            disabled={loading}
            $background={background}
            {...rest}
        >
            {Icon && <Icon />}
            { loading ? 'Carregando...' : title }
        </Container>
    );
}