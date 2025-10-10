import { useCallback, useEffect, useState } from 'react';
import { Container, W50, InputWrapper } from './styles';

import { Fixed } from '../../components/Fixed';
import { Section } from '../../components/Section';
import { InputSelect } from '../../components/InputSelect';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

export function Users() {

    const { user, updateProfile } = useAuth();

    const [users, setUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [animationLoading, setAnimationLoading] = useState(false);
    const [modeEdit, setModeEdit] = useState(user.role === "admin" ? false : true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const clearFields = useCallback(() => {
        setSelectedUser(null);
        setSelectedDomain(null);
        setName("");
        setEmail("");
        setOldPassword("");
        setNewPassword("");
        setModeEdit(false);
    }, []);

    const handleModeUpdate = useCallback(() => {
        if(selectedUser) {
            setModeEdit(!modeEdit);
            if(!modeEdit) {
                setName(selectedUser.name);
                setEmail(selectedUser.email);

                const nameDomain = domains.find(domain => domain.id === selectedUser.domain_id);
                setSelectedDomain(nameDomain);
            } else {
                clearFields();
            };
        };
    }, [selectedUser, modeEdit, domains, clearFields]);

    const fetchGetUsersAndDomains = useCallback(async () => {
        if(user.role === "admin") {
            setAnimationLoading(true);
            const responseUsers = await api.get("/users");
            const responseDomains = await api.get("/domains");
            setUsers(responseUsers.data);
            setDomains(responseDomains.data);
            setAnimationLoading(false);
        };
    }, []);

    const handleSendForm = useCallback(async () => {
        setLoading(true);
        try {
            if(!modeEdit) {
                await api.post("/users", {
                    name,
                    email,
                    password: newPassword,
                    domain_id: selectedDomain?.id
                });
                alert("Usuário cadastrado com sucesso!");
                fetchGetUsersAndDomains();
                clearFields();
            } else {
                const updated = {
                    name,
                    email,
                    password: newPassword,
                    old_password: oldPassword,
                    domain_id: selectedDomain?.id,
                    modify_user_id: selectedUser?.id
                };
                let sessionUpdated;

                if(user.id === selectedUser?.id || user.role !== "admin") {
                    const dataUpdated = {
                        name: name !== '' ? name : user.name,
                        email: email !== '' ? email : user.email,
                    };
                    sessionUpdated = { ...user, ...dataUpdated };
                };

                await updateProfile({ user: updated, sessionUpdated });
                fetchGetUsersAndDomains();
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
    }, [name, email, newPassword, oldPassword, selectedDomain, modeEdit, selectedUser, user, updateProfile, fetchGetUsersAndDomains, clearFields]);

    const handleDeleteUser = useCallback(async () => {
        setLoadingDelete(true);

        try {
            const confirm = window.confirm("Deseja realmente deletar o perfil?");

            if(confirm) {
                await api.delete(`/users/${selectedUser?.id}`);
                alert("Perfil deletado com sucesso.");
                fetchGetUsersAndDomains();
                clearFields();
            };
        } catch(error) {
            if(error.response) {
                alert(error.response.data.message);
            } else {
                alert("Não foi possível deletar o perfil.");
            };
        } finally {
            setLoading(false);
        }
    }, [selectedUser, fetchGetUsersAndDomains, clearFields]);

    const handleSelectUser = useCallback((option) => {
        if(selectedUser && selectedUser.id !== option.id) {
            clearFields();
        };
        setSelectedUser(option);
    }, [selectedUser, clearFields]);

    const handleSelectDomain = useCallback((option) => {
        setSelectedDomain(option);
    }, []);

    useEffect(() => {
        if(user.role === "admin") {
            fetchGetUsersAndDomains();
        };
    }, [user.role, fetchGetUsersAndDomains]);

    return (
        <Fixed title="Usuários" route="/users">
            {
                animationLoading ?

                    <LoadingSpinner loading={animationLoading} className="usersLoading" />

                :

                    <Container>
                        {
                            user.role === "admin" &&
                            <Section title="Usuários Registrados">
                                <W50>
                                    <InputWrapper>
                                        <label>E-mail</label>

                                        <InputSelect 
                                            title="Selecione o e-mail atual do usuário"
                                            group="email"
                                            options={users}
                                            objectValue="email"
                                            onSelect={handleSelectUser}
                                            selected={selectedUser}
                                        />
                                    </InputWrapper>
                                    <InputWrapper className="buttons">
                                        <Button 
                                            title="Excluir" 
                                            background="admin" 
                                            onClick={handleDeleteUser}
                                            loading={loadingDelete}
                                        />
                                        <Button 
                                            title={modeEdit ? "Limpar" : "Editar"}
                                            onClick={handleModeUpdate}
                                        />
                                    </InputWrapper>
                                </W50>
                            </Section>
                        }
                        

                        <Section title={modeEdit ? "Editar Perfil" : "Criar Perfil"}>
                            <W50>
                                <InputWrapper>
                                    <label>Nome</label>

                                    <Input 
                                        placeholder="Digite o nome"
                                        background="admin"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </InputWrapper>
                                
                                <InputWrapper>
                                    <label>E-mail</label>

                                    <Input
                                        type="email"
                                        placeholder="Digite o e-mail"
                                        background="admin"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </InputWrapper>
                            </W50>
                            
                            <W50>                   
                                {
                                    modeEdit &&                        
                                    <InputWrapper>
                                        <label>Senha Antiga</label>

                                        <Input
                                            type="password"
                                            placeholder="Digite a senha antiga"
                                            background="admin"
                                            value={oldPassword}
                                            onChange={e => setOldPassword(e.target.value)}
                                        />
                                    </InputWrapper>
                                }

                                <InputWrapper>
                                    <label>{modeEdit ? "Nova Senha" : "Senha"}</label>

                                    <Input 
                                        type="password"
                                        placeholder={modeEdit ? "Digite a nova senha" : "Digite a senha"}
                                        background="admin"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                    />
                                </InputWrapper>
                            </W50>
                            
                            <W50>
                                {
                                    user.role === "admin" && (!modeEdit || (modeEdit && selectedUser?.domain_id !== null)) &&
                                    <InputWrapper>
                                        <label>Domínio Vinculado</label>

                                        <InputSelect 
                                            title="Selecione o domínio para vincular"
                                            group="domain"
                                            options={domains}
                                            objectValue="domain_name"
                                            onSelect={handleSelectDomain}
                                            selected={selectedDomain}
                                        />
                                    </InputWrapper>
                                }
                            </W50>
                            <Button title="Salvar" onClick={handleSendForm} loading={loading} />
                        </Section>
                    </Container>
            }
            
        </Fixed>
    );
}