import { Container, Details, PublicationDate } from './styles';

export function Publication({ data, ...rest }) {
    return (
        <Container type="button" {...rest}>
            <Details>
                <h3>{data.name}{data.number && `, ${data.number}`}</h3>
            </Details>
            <PublicationDate>
                <span>Data:</span>
                <span>{data.date}</span>
            </PublicationDate>
        </Container>
    );
}