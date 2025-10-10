import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, Publications } from "./styles";

import { Fixed } from "../../components/Fixed";
import { Publication } from "../../components/Publication";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Search } from "../../components/Search";
import { api } from "../../services/api";

export function Home() {
    const [data, setData] = useState([]);
    const [publications, setPublications] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    function handleLinkClick(publicationId) {
        navigate(`publication/${publicationId}`);
    };

    useEffect(() => {
        async function fetchPublications() {
            setLoading(true);
            const params = new URLSearchParams(location.search);
            const types = params.get('types');
            const years = params.get('years');
            const domains = params.get('domains');

            try {
                const response = await api.get("/publications", {
                    params: {
                        types: types?.length > 0 ? types : null,
                        years: years?.length > 0 ? years : null,
                        domains: domains?.length > 0 ? domains : null,
                        searchText: search
                    }
                });
                setData(response.data);
                setPublications(response.data);
            } catch(error) {
                if(error.response) {
                    alert(error.response.data.message);
                } else {
                    alert("Não foi possível acessar os dados das publicações");
                };
            } finally {
                setLoading(false);
            };
        };

        fetchPublications();
    }, [location.search, search]);

    return (
        <Fixed title="Publicações" route="/">
            <Container>

                <Search setSearch={setSearch}/>

                {
                    loading ?

                    <LoadingSpinner loading={loading} className="homeLoading" />

                    :

                    <Publications>
                        {
                            publications.map((publication, index) => (
                                <Publication 
                                    key={index}
                                    data={publication}
                                    onClick={() => handleLinkClick(publication.publication_id)}
                                />
                            ))
                        }
                    </Publications>
                }

            </Container>
        </Fixed>
    );
}