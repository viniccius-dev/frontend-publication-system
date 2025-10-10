import { useState, useCallback, useEffect } from 'react';

import { Container, W50, InputWrapper, CheckList } from './styles';
import { Fixed } from "../../components/Fixed";
import { Section } from "../../components/Section";
import { Input } from "../../components/Input";
import { InputSelect } from '../../components/InputSelect';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

export function PublicationTypes() {

    const { user } = useAuth();

    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [animationLoading, setAnimationLoading] = useState(false);
    const [modeEdit, setModeEdit] = useState(false);

    const [name, setName] = useState("");
    const [numberTitle, setNumberTitle] = useState("");
    const [dateTitle, setDateTitle] = useState("");
    const [descriptionTitle, setDescriptionTitle] = useState("");
    const [fileTitle, setFileTitle] = useState("");
    const [selectedFields, setSelectedFields] = useState({
        number: false,
        date: false,
        description: false,
        file: false
    });

    const handleToggleField = (field) => {
        setSelectedFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const isAtLeastOneFieldSelected = () => {
        return Object.values(selectedFields).some(value => value);
    };

    const areSelectedFieldsFilled = () => {
        if (selectedFields.number && !numberTitle) {
            alert("O campo 'Número' está marcado, mas não foi preenchido.");
            return false;
        }
        if (selectedFields.date && !dateTitle) {
            alert("O campo 'Data' está marcado, mas não foi preenchido.");
            return false;
        }
        if (selectedFields.description && !descriptionTitle) {
            alert("O campo 'Descrição' está marcado, mas não foi preenchido.");
            return false;
        }
        if (selectedFields.file && !fileTitle) {
            alert("O campo 'Arquivo' está marcado, mas não foi preenchido.");
            return false;
        }
        return true;
    };

    const clearFields = useCallback(() => {
        setSelectedType(null);
        setName("");
        setNumberTitle("");
        setDateTitle("");
        setDescriptionTitle("");
        setFileTitle("");
        setModeEdit(false);
    }, []);

    const handleModeUpdate = useCallback(() => {
        if(selectedType) {
            setModeEdit(!modeEdit);
            if(!modeEdit) {
                setName(selectedType.name);
                setNumberTitle(selectedType.number_title);
                setDateTitle(selectedType.date_title);
                setDescriptionTitle(selectedType.description_title);
                setFileTitle(selectedType.file_title);
            } else {
                clearFields();
            };
        };
    }, [selectedType, modeEdit, clearFields]);

    const fetchGetTypes = useCallback(async () => {
        if(user.role === "admin") {
            setAnimationLoading(true);
            const responseTypes = await api.get("/types-of-publication");
            setTypes(responseTypes.data);
            setAnimationLoading(false);
        }
    }, []);

    const handleSendForm = useCallback(async () => {
        // Validação dos campos selecionados
        if (!isAtLeastOneFieldSelected()) {
            alert("Por favor, selecione pelo menos um campo para preenchimento.");
            return;
        }
    
        if (!areSelectedFieldsFilled()) {
            return;
        }

        setLoading(true);
        try {
            if(!modeEdit) {
                await api.post("/types-of-publication", {
                    name,
                    number_title: numberTitle === '' ? null : numberTitle,
                    date_title: dateTitle === '' ? null : dateTitle,
                    description_title: descriptionTitle === '' ? null : descriptionTitle,
                    file_title: fileTitle === '' ? null : fileTitle
                });
                alert("Tipo de publicação cadastrado com sucesso.");
                fetchGetTypes();
                clearFields();
            } else {
                const updated = {
                    name,
                    number_title: numberTitle === '' ? null : numberTitle,
                    date_title: dateTitle === '' ? null : dateTitle,
                    description_title: descriptionTitle === '' ? null : descriptionTitle,
                    file_title: fileTitle === '' ? null : fileTitle
                };

                await api.put(`/types-of-publication/${selectedType?.id}`, updated);
                alert("Tipo de publicação atualizado com sucesso.");
                fetchGetTypes();
            };
        } catch (error) {
            if(error.response) {
                alert(error.response.data.message);
            } else {
                alert("Não foi possível realizar a operação");
            };
        } finally {
            setLoading(false);
        };
    }, [name, numberTitle, dateTitle, descriptionTitle, fileTitle, selectedType, modeEdit, user, fetchGetTypes, clearFields]);

    const handleDeleteType = useCallback(async () => {
        setLoadingDelete(true);

        try {
            const confirm = window.confirm("Deseja realmente deletar o tipo de publicação?");

            if(confirm) {
                await api.delete(`/types-of-publication/${selectedType?.id}`);
                alert("Tipo de publicação deletado com sucesso.");
                fetchGetTypes();
                clearFields();
            };
        } catch (error) {
            if(error.response) {
                alert(error.response.data.message);
            } else {
                alert("Não foi possível excluir o tipo de publicação");
            };
        } finally {
            setLoadingDelete(false);
        };
    }, [selectedType, fetchGetTypes, clearFields]);

    const handleSelectType = useCallback((option) => {
        if(selectedType && selectedType.id !== option.id) {
            clearFields();
        };
        setSelectedType(option);
    }, [selectedType, clearFields]);

    useEffect(() => {
        if(user.role === "admin") {
            fetchGetTypes();
        }
    }, [user.role, fetchGetTypes]);

    useEffect(() => {
        if(modeEdit && selectedType) {
            setSelectedFields({
                number: !!selectedType.number_title,
                date: !!selectedType.date_title,
                description: !!selectedType.description_title,
                file: !!selectedType.file_title,
            });
        } else {
            setSelectedFields({
                number: false,
                date: false,
                description: false,
                file: false,
            });
        };
    }, [modeEdit, selectedType]);

    useEffect(() => {
        if (!selectedFields.number) setNumberTitle("");
        if (!selectedFields.date) setDateTitle("");
        if (!selectedFields.description) setDescriptionTitle("");
        if (!selectedFields.file) setFileTitle("");
    }, [selectedFields]);

    return (
        <Fixed title="Tipos de Publicações" route="/publication-types">
            {
                animationLoading ?

                    <LoadingSpinner loading={animationLoading} className="typesLoading" />

                :

                    <Container>
                        <Section title="Tipos de Publicações Registrados">
                            <W50>
                                <InputWrapper>
                                    <label>Tipo</label>

                                    <InputSelect 
                                        title="Selecione o tipo de publicação"
                                        group="types"
                                        options={types}
                                        objectValue="name"
                                        onSelect={handleSelectType}
                                        selected={selectedType}
                                    />
                                </InputWrapper>
                                <InputWrapper className="buttons">
                                    <Button 
                                        title="Excluir"
                                        background="admin"
                                        onClick={handleDeleteType}
                                        loading={loadingDelete}
                                    />
                                    <Button 
                                        title={modeEdit ? "Limpar" : "Editar"}
                                        onClick={handleModeUpdate}
                                    />
                                </InputWrapper>
                            </W50>
                        </Section>

                        <Section title={modeEdit ? "Editar tipo de publicação" : "Criar tipo de publicação"}>
                            <InputWrapper>
                                <label>Nome do tipo de publicação</label>

                                <Input 
                                    placeholder="Digite o nome"
                                    background="admin"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </InputWrapper>
                            <InputWrapper>
                                <label>Selecione os campos para preenchimento</label>

                                <CheckList>
                                    <Checkbox
                                        checked={selectedFields.number}
                                        onClick={() => handleToggleField("number")}
                                    >
                                        Número
                                    </Checkbox>
                                    <Checkbox
                                        checked={selectedFields.date}
                                        onClick={() => handleToggleField("date")}
                                    >
                                        Data
                                    </Checkbox>
                                    <Checkbox
                                        checked={selectedFields.description}
                                        onClick={() => handleToggleField("description")}
                                    >
                                        Descrição
                                    </Checkbox>
                                    <Checkbox
                                        checked={selectedFields.file}
                                        onClick={() => handleToggleField("file")}
                                    >
                                        Arquivo
                                    </Checkbox>
                                </CheckList>
                            </InputWrapper>
                            <W50>
                                {
                                    selectedFields.number &&

                                    <InputWrapper>
                                        <label>título do campo: Número</label>

                                        <Input 
                                            placeholder="Digite o nome do campo número"
                                        background="admin"
                                            value={numberTitle}
                                            onChange={e => setNumberTitle(e.target.value)}
                                        />
                                    </InputWrapper>
                                }
                                {
                                    selectedFields.date &&

                                    <InputWrapper>
                                        <label>título do campo: Data</label>

                                        <Input 
                                            placeholder="Digite o nome do campo data"
                                        background="admin"
                                            value={dateTitle}
                                            onChange={e => setDateTitle(e.target.value)}
                                        />
                                    </InputWrapper>
                                }
                            </W50>
                            <W50>
                                {
                                    selectedFields.description &&

                                    <InputWrapper>
                                        <label>título do campo: Descrição</label>

                                        <Input 
                                            placeholder="Digite o nome do campo descrição"
                                            background="admin"
                                            value={descriptionTitle}
                                            onChange={e => setDescriptionTitle(e.target.value)}
                                        />
                                    </InputWrapper>
                                }
                                {
                                    selectedFields.file &&


                                    <InputWrapper>
                                        <label>título do campo: Arquivos</label>

                                        <Input 
                                            placeholder="Digite o nome do campo arquivos"
                                        background="admin"
                                            value={fileTitle}
                                            onChange={e => setFileTitle(e.target.value)}
                                        />
                                    </InputWrapper>
                                }
                            </W50>
                            <Button title="Salvar" 
                                onClick={handleSendForm} 
                                loading={loading} 
                                disabled={!isAtLeastOneFieldSelected()}
                            />
                        </Section>
                    </Container>
            }
        </Fixed>
    );
}