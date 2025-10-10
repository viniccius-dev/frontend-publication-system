import { FiSearch } from 'react-icons/fi';

import { Container } from './styles';
import { Input } from '../Input';

export function Search({ setSearch }) {

    return (
        <Container>
            <Input 
                icon={FiSearch}
                placeholder="Pesquisar licitação..."
                onChange={(e) => setSearch(e.target.value)}
                background="admin"
            />
        </Container>
    );
}