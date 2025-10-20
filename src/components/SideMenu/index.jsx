import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';
import { BiDesktop } from 'react-icons/bi';
import { TbLogout2, TbNetwork } from 'react-icons/tb';
import { FaCodeBranch, FaUsers, FaUser } from 'react-icons/fa';
import { MdAssignment, MdOutlineKeyboardArrowDown } from 'react-icons/md';

import { api } from "../../services/api";
import { useAuth } from '../../hooks/auth';
import { Container, Header, Title, Button, Nav, Footer, Role } from './styles';
import imgAvatarPlaceholder from "../../assets/avatar_placeholder.svg";

export function SideMenu({ menuIsOpen, onCloseMenu, onLinkClick }) {
    const { user, signOut } = useAuth();
    const navigation = useNavigate();

    const [filtersVisible, setFiltersVisible] = useState(false);
    const [activeLink, setActiveLink] = useState(onLinkClick);
    const [types, setTypes] = useState([]);
    const [years, setYears] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);
    const [selectedDomains, setSelectedDomains] = useState([]);

    const toggleFilters = () => {
        if(activeLink === "/") {
            setFiltersVisible(!filtersVisible);
        }
    };

    function handleSignOut() {
        navigation("/");
        signOut();
    };

    const handleLinkClick = (linkName) => {
        if(linkName !== "/" || activeLink !== "/" && linkName === "/") {
            onCloseMenu();
            navigation(linkName);
        }
        setActiveLink(linkName);
    };

    const handleTypesChange = (e) => {
        const { value, checked } = e.target;
        setSelectedTypes(prev => {
            if(checked) {
                return [...prev, value];
            } else {
                return prev.filter(type => type !== value);
            };
        });
    };

    const handleYearsChange = (e) => {
        const { value, checked } = e.target;
        setSelectedYears(prev => {
            if(checked) {
                return [...prev, value];
            } else {
                return prev.filter(year => year !== value);
            };
        });
    };

    const handleDomainsChange = (e) => {
        const { value, checked } = e.target;
        setSelectedDomains(prev => {
            if(checked) {
                return [...prev, value];
            } else {
                return prev.filter(domain => domain !== value);
            };
        });
    };

    useEffect(() => {
        async function fetchFilters() {
            try {
                const response = await api.get("/publications/filters");
                setTypes(response.data.types);
                setYears(response.data.years);
                setDomains(response.data.domains);
            } catch(error) {
                if(error.response) {
                    alert(error.response.data.message);
                } else {
                    alert("Não foi possível acessar os dados do domínio");
                };
            };
        };

        fetchFilters();
    }, [setTypes, setYears]);

    useEffect(() => {
        const queryParams = new URLSearchParams();
        if(selectedTypes.length) {
            queryParams.append('types', selectedTypes.join(','));
        };
        if (selectedYears.length) {
            queryParams.append('years', selectedYears.join(','));
        };
        if (selectedDomains.length) {
            queryParams.append('domains', selectedDomains.join(','));
        };
        const queryString = queryParams.toString();
        if(queryString) {
            navigation(`/?${queryString}`);
        } else if (activeLink === "/") {
            navigation('/');
        }
    }, [selectedTypes, selectedYears, selectedDomains, navigation]);

    return (
        <Container data-menu-is-open={menuIsOpen}>
            <Header>
                <Title><BiDesktop /> Painel Administrativo</Title>

                {menuIsOpen && (
                    <Button>
                        <HiXMark onClick={onCloseMenu} />
                    </Button>
                )}
            </Header>

            <Nav>
                <a 
                    className="bidsButton"
                    data-filters-active={filtersVisible}
                    style={{cursor: "default"}}
                    onClick={() => handleLinkClick("/")}
                    data-menu-active={
                        activeLink === "/" ||
                        activeLink === "/create-publication" || 
                        activeLink === "/details" ||
                        activeLink === "/edit-publication"
                    }
                >
                    <div onClick={toggleFilters} style={{cursor: "pointer"}}>
                            <MdAssignment /> Publicações {" "}
                            <MdOutlineKeyboardArrowDown data-filters-active={filtersVisible} />
                    </div> 
                    <div className="bidsFilters">
                        {
                            user.role === "admin" &&
                            <ul>
                                <label>Domínios</label>
                                {domains.map((domain, index) => (
                                    <li key={index}>
                                        <label>
                                            <input 
                                                type="checkbox"
                                                value={domain}
                                                name="domains"
                                                onChange={handleDomainsChange}
                                                checked={selectedDomains.includes(domain)}
                                            />
                                            <span>{domain}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        }

                        <ul>
                            <label>Tipo</label>
                            {types.map((type, index) => (
                                <li key={index}>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value={type}
                                            name="types"
                                            onChange={handleTypesChange}
                                            checked={selectedTypes.includes(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <ul>
                            <label>Ano</label>
                            {years.map((year, index) => (
                                <li key={index}>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value={year}
                                            name="years"
                                            onChange={handleYearsChange}
                                            checked={selectedYears.includes(String(year))}
                                        />
                                        <span>{year}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </a>

                <a
                    data-menu-active={activeLink === "/users"}
                    onClick={() => handleLinkClick("/users")}
                >
                    {user.role !== "admin" ? <FaUser />  : <FaUsers /> }
                    {user.role !== "admin" ? "Perfil" : "Usuários"}
                </a>

                {
                    user.role === "admin" &&
                    <a
                        data-menu-active={activeLink === "/domains"}
                        onClick={() => handleLinkClick("/domains")}
                    >
                        <TbNetwork /> Domínios
                    </a>
                }

                {
                    user.role === "admin" &&
                    <a
                        data-menu-active={activeLink === "/publication-types"}
                        onClick={() => handleLinkClick("/publication-types")}     
                    >
                        <FaCodeBranch />Tipos de Publicação
                    </a>
                }

                {
                    user.role === "admin" &&
                    <a
                        data-menu-active={activeLink === "/backup"}
                        onClick={() => handleLinkClick("/backup")}
                    >
                        <FaCodeBranch />Backups
                    </a>
                }

                <a
                    data-menu-active={activeLink === "/logout"}
                    onClick={handleSignOut}
                >
                    <TbLogout2 />Sair da Conta
                </a>
            </Nav>

            <Footer>
                <img src={imgAvatarPlaceholder} alt="Foto do usuário" />
                <div>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                </div>

                <Role type="button">{user.role}</Role>
            </Footer>
        </Container>
    );
}