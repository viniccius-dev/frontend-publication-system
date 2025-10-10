import { FaClock } from 'react-icons/fa';
import { TfiDropboxAlt } from "react-icons/tfi";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Container, NotFound } from './styles';
import { Section } from '../../components/Section';
import { Button } from '../../components/Button';
import { Fixed } from '../../components/Fixed';
import { File } from '../../components/File';
import { LoadingSpinner } from '../../components/LoadingSpinner';

import { api } from '../../services/api';

export function Details() {
    const [publication, setPublication] = useState(null);
    const [mainAttachment, setMainAttachment] = useState(null);
    const [additionalAttachments, setAdditionalAttachments] = useState([]);

    const [animationLoading, setAnimationLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    function handleLinkClick(pathFile) {
        window.open(`${api.defaults.baseURL}/files/${pathFile}`, '_blank');
    };

    async function handleDeletePublication() {
        try {
            const confirm = window.confirm("Tem certeza que deseja deletar essa publicação e os documentos anexados a ela? Esta ação não poderá ser desfeita.");

            if(confirm) {
                setDeleteLoading(true);
                const mainFile = { attachments: mainAttachment?.id ? [mainAttachment.id] : [] };
                const subAttachmentFiles = { attachments: additionalAttachments.map(attachment => attachment.id) };
                const files = [...mainFile.attachments, ...subAttachmentFiles.attachments];

                await api.delete(`/publications/${params.id}`, { data: files });
                alert("Publicação deletada com sucesso.");
                navigate("/");
            };
        } catch(error) {
            if(error.response) {
                alert(error.response.data.message);
            } else {
                alert("Não foi possível deletar a publicação.");
            };
        } finally {
            setDeleteLoading(false);
        };
    };

    function handleLinkEdit() {
        navigate(`/edit-publication/${params.id}`);
    };

    function formatDateTime(dateTime) {
        const dateObj = new Date(dateTime);
    
        // Ajusta o horário para -3 horas
        dateObj.setHours(dateObj.getHours() - 3);
    
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
        const year = dateObj.getFullYear();
    
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
        return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
    }

    function getFileExtension(filename) {
        return filename.split('.').pop();
    };

    useEffect(() => {
        setAnimationLoading(true);
        async function fetchPublication() {
            try {
                const responsePublication = await api.get(`/publications/${params.id}`);
                const responseAttachments = await api.get(`/publications/attachments/${params.id}`);
                setPublication(responsePublication.data);

                const main = responseAttachments.data.find(file => file.type === 'main');
                const additional = responseAttachments.data.filter(file => file.type === 'subattachments');

                setMainAttachment(main || null);
                setAdditionalAttachments(additional);
            } catch(error) {
                if(error.response) {
                    console.error(error.response.data.message);
                } else {
                    console.error("erro ao cadastrar a publicação");
                };
            } finally {
                setAnimationLoading(false);
            }
        };

        fetchPublication();
    }, []);

    return (
        <Fixed title="Publicação" route="/details">
            {
                animationLoading ?

                    <LoadingSpinner loading={animationLoading} />

                :

                    publication ?

                    <Container>
                        <header>
                            <h2>
                                {publication.name}{publication.number && `, ${publication.number}`}{publication.date && `, ${publication.date}`}
                            </h2>
                            <small><FaClock /> Publicado em: {formatDateTime(publication.updated_at)}</small>
                        </header>

                        {
                            mainAttachment &&
                            <Section title={publication.file_title}>
                                <File
                                    title={mainAttachment.name}
                                    extension={getFileExtension(mainAttachment.attachment)}
                                    onClick={() => handleLinkClick(mainAttachment.attachment)}
                                />
                            </Section>
                        }

                        {
                            publication.description_title &&

                            <Section title={publication.description_title}>
                                <p>{publication.description}</p>
                            </Section>
                        }

                        {
                            additionalAttachments.length > 0 &&
                            <Section title="Anexos Adicionais">
                                {additionalAttachments.map((file, index) => (
                                    <File 
                                        key={index}
                                        title={file.name}
                                        extension={getFileExtension(file.attachment)}
                                        onClick={() => handleLinkClick(file.attachment)}
                                    />
                                ))}
                            </Section>
                        }

                        <footer>        
                            <Button title="Editar" onClick={handleLinkEdit} />
                            <Button background="admin" title="Excluir" onClick={handleDeletePublication} loading={deleteLoading} />
                        </footer>
                    </Container>

                    :

                    <NotFound>
                        <h2><TfiDropboxAlt /> Publicação Não Encontrada</h2>
                    </NotFound>
            }
            
        </Fixed>
    );
}