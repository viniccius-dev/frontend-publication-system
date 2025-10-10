import { useNavigate } from 'react-router-dom';

import { Container, Menu } from "./styles";
import { Button } from "../Button";

import { FaArrowLeft, FaList, FaPlus } from "react-icons/fa";

export function Header({ title, onOpenMenu }) {
    const navigate = useNavigate();

    function handleBack() {
        navigate(-1);
    }

    function handleLinkClick() {
       navigate("/create-publication");
    }

    return (
        <Container>
            <Menu onClick={onOpenMenu}>
                <FaList />
            </Menu>

            <h1>{title}</h1>

            {
                title !== "Publicações"
                ?
                <Button icon={FaArrowLeft} title="Voltar" onClick={handleBack} />
                :
                <Button icon={FaPlus} title="Adicionar Publicação" onClick={handleLinkClick} />
            }
            
        </Container>
    );
}