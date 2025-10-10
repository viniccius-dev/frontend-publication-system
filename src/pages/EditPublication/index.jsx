import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TfiDropboxAlt } from "react-icons/tfi";
import { FaXmark } from 'react-icons/fa6';

import { Container, InputWrapper, Archive, NotFound } from './styles';

import { Input } from '../../components/Input';
import { File } from "../../components/File";
import { InputSelect } from '../../components/InputSelect';
import { Textarea } from '../../components/Textarea';
import { Uploads } from '../../components/Uploads';
import { Button } from '../../components/Button';
import { Fixed } from '../../components/Fixed';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

export function EditPublication() {
    const { user } = useAuth();
    const params = useParams();

    const [saveLoading, setSaveLoading] = useState(false);
    const [animationLoading, setAnimationLoading] = useState(false);
    const [previousSelectedType, setPreviousSelectedType] = useState(null);

    const [publication, setPublication] = useState(null);
    const [mainAttachment, setMainAttachment] = useState(null);
    const [additionalAttachments, setAdditionalAttachments] = useState([]);
    const [deleteAttachments, setDeleteAttachments] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);

    const [number, setNumber] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [isMainUploadDisabled, setIsMainUploadDisabled] = useState(true);
    const [mainFile, setMainFile] = useState([]);
    const [additionalFiles, setAdditionalFiles] = useState([]);

    function getFileExtension(filename) {
        return filename.split('.').pop();
    };

    function handleLinkClick(pathFile) {
        window.open(`${api.defaults.baseURL}/files/${pathFile}`, '_blank');
    };

    const handleMainFilesChange = (newFiles) => {
        setMainFile(newFiles);
    };
    
    const handleAdditionalFilesChange = (newFiles) => {
        setAdditionalFiles(newFiles);
    };

    const handleFilesDelete = (file) => {
        const confirm = window.confirm(`Deseja deletar o arquivo ${file.name}`);

        if(confirm) {
            setDeleteAttachments(files => [...files, file.id]);
            if (mainAttachment?.id === file.id) {
                setMainAttachment(null);
                setIsMainUploadDisabled(false);
            }
            setAdditionalAttachments((attachments) =>
                attachments.filter((attachment) => attachment.id !== file.id)
            );
        };
    };

    const isValidDateTime = (dateString) => {
        // Valida o formato inicial com uma expressão regular
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = dateString.match(regex);
    
        if (!match) {
            return false;
        }
    
        const [_, day, month, year] = match.map(Number);
    
        // Cria uma data no formato ISO e verifica se é válida
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    };

    const handleSubmit = async () => {
        const errors = [];

        if(selectedType?.number_title && !number.trim()) {
            errors.push(`O campo ${selectedType?.number_title} não pode estar vazio.`);
        };

        if(selectedType?.date_title) {
            if(!date.trim()) {
                errors.push(`O campo ${selectedType?.date_title} não pode estar vazio.`)
            } else if(!isValidDateTime(date)) {
                errors.push("Data inválida. Por favor, verifique e tente novamente.");
            };
        };

        if(selectedType?.description_title && !description.trim()) {
            errors.push(`O campo ${selectedType?.description_title} não pode estar vazio.`);
        };

        if(selectedType?.file_title && !mainAttachment && mainFile.length === 0) {
            errors.push(`É necessário inserir ${selectedType?.file_title}.`);
        };

        if(errors.length > 0) {
            alert(errors.join("\n"));
            return;
        };

        const publicationData = {
            type_of_publication_id: selectedType?.id,
            number: number === '' ? null : number,
            date: date === '' ? null : date,
            description: description === '' ? null : description
        };

        try {
            setSaveLoading(true);

            await api.put(`/publications/${params.id}`, publicationData);
            const deleteFiles = { attachments: deleteAttachments };

            if(deleteAttachments.length > 0) {
                await api.delete(`/publications/attachments`, { data: deleteFiles });
            };

            if(mainFile.length > 0) {
                const mainFormData = new FormData();
                mainFile.forEach(fileObj => {
                    mainFormData.append("attachment", fileObj.file);
                });
                mainFormData.append("type", "main");

                await api.post(`/publications/attachments/${params.id}`, mainFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            };

            if (additionalFiles.length > 0) {
                const subAttachmentFormData = new FormData();
                additionalFiles.forEach(fileObj => {
                    subAttachmentFormData.append("attachment", fileObj.file);
                });
                subAttachmentFormData.append("type", "subattachments");

                await api.post(`/publications/attachments/${params.id}`, subAttachmentFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            
            alert("Publicação atualizada com sucesso!");
            location.reload();
        } catch(error) {
            if(error.response) {
                alert(error.response.data.message);
            } else {
                alert("Erro ao atualizar a publicação.");
            };
        } finally {
            setSaveLoading(false);
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            setAnimationLoading(true);
            try {
                // Realiza todas as chamadas da API
                const [attachmentsResponse, typesResponse, publicationResponse] = await Promise.all([
                    api.get(`/publications/attachments/${params.id}`),
                    api.get(`/types-of-publication`),
                    api.get(`/publications/${params.id}`),
                ]);
    
                // Define os estados com os dados recebidos
                const main = attachmentsResponse.data.find(file => file.type === 'main');
                const additional = attachmentsResponse.data.filter(file => file.type === 'subattachments');

                setMainAttachment(main || null);
                setAdditionalAttachments(additional);
                setTypes(typesResponse.data);
                setPublication(publicationResponse.data);
    
                // Determina o tipo selecionado baseado nos dados carregados
                const matchedType = typesResponse.data.find(
                    type => type.name === publicationResponse.data.name
                );
                setSelectedType(matchedType);
    
                // Atualiza os estados relacionados à publicação
                setNumber(publicationResponse.data.number);
                setDate(publicationResponse.data.date);
                setDescription(publicationResponse.data.description);
            } catch (error) {
                if (error.response) {
                    console.error(error.response.data.message);
                } else {
                    console.error("Não foi possível acessar os dados da publicação");
                }
            } finally {
                setAnimationLoading(false);
            }
        };
    
        fetchData();
    }, [user.role, params.id]);

    // Função para limpar os campos
    const clearFields = () => {
        setNumber("");
        setDate("");
        setDescription("");
        setMainFile([]);
        setAdditionalFiles([]);
    };

    useEffect(() => {
        // Verifica se selectedType mudou de um valor não nulo para nulo
        if (previousSelectedType !== null && previousSelectedType?.id !== selectedType?.id) {
            clearFields();  // Limpa os campos somente se o valor anterior não era null
        }

        setPreviousSelectedType(selectedType);
    }, [selectedType]);
    
    return (
        <Fixed title="Editar Publicação" route="/edit-publication">

            {
                animationLoading ?
                
                    <LoadingSpinner loading={animationLoading} />

                :

                    publication ?

                    <Container>
                        <InputWrapper>
                            <label>Tipo de publicação</label>

                            <InputSelect 
                                title="Selecione o tipo de publicação"
                                group="modalities"
                                options={types}
                                objectValue="name"
                                onSelect={option => setSelectedType(option)}
                                selected={selectedType}
                            />
                        </InputWrapper>

                        {
                            selectedType?.file_title && mainAttachment && 

                            <InputWrapper className="currentFiles">
                                <label>{selectedType.file_title} Atual</label>
                                <div className="savedUploads">
                                    {
                                            mainAttachment &&

                                            <Archive>
                                                <File 
                                                    title={mainAttachment.name} 
                                                    extension={getFileExtension(mainAttachment.attachment)} 
                                                    onClick={() => handleLinkClick(mainAttachment.attachment)}
                                                />
                                                <FaXmark onClick={() => handleFilesDelete(mainAttachment)} />
                                            </Archive>
                                    }
                                </div>
                            </InputWrapper>
                        }

                        {
                            selectedType?.file_title && 

                            <InputWrapper>
                                <label>Adicionar {selectedType.file_title}</label>
                                <Uploads
                                    onFilesChange={handleMainFilesChange}
                                    main={true}
                                    disabled={isMainUploadDisabled}
                                />
                            </InputWrapper>
                        }

                        {
                            selectedType?.number_title &&

                            <InputWrapper>
                                <label>{selectedType.number_title}</label>

                                <Input 
                                    placeholder={`Digite o número da publicação`} 
                                    background="admin"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                />
                            </InputWrapper>
                        }
                        {
                            selectedType?.date_title &&

                            <InputWrapper>
                                <label>{selectedType.date_title}</label>

                                <Input
                                    placeholder="Digite a data da publicação"
                                    background="admin"
                                    maskType="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </InputWrapper>
                        }
                        {
                            selectedType?.description_title &&

                            <InputWrapper>
                                <label>{selectedType.description_title}</label>

                                <Textarea 
                                    placeholder="Digite a descrição da publicação"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                />
                            </InputWrapper>
                        }

                        {
                            additionalAttachments.length > 0 && 

                            <InputWrapper className="currentFiles">
                                <label>Anexos Salvos</label>
                                <div className="savedUploads">
                                    {
                                        additionalAttachments.map((file, index) => (
                                            <Archive key={index}>
                                                <File 
                                                    title={file.name} 
                                                    extension={getFileExtension(file.attachment)} 
                                                    onClick={() => handleLinkClick(file.attachment)}
                                                />
                                                <FaXmark onClick={() => handleFilesDelete(file)} />
                                            </Archive>
                                        ))
                                    }
                                </div>
                            </InputWrapper>
                        }

                        

                        <InputWrapper>
                            <label>Adicionar Anexos</label>
                            <Uploads onFilesChange={handleAdditionalFilesChange} disabled={false} />
                        </InputWrapper>

                        <InputWrapper>
                            <Button 
                                title="Editar"
                                onClick={handleSubmit}
                                loading={saveLoading}
                            />
                        </InputWrapper>
                    </Container>

                    :

                    <NotFound>
                        <h2><TfiDropboxAlt /> Licitação Não Encontrada</h2>
                    </NotFound>
            }
            
        </Fixed>
    );
}
