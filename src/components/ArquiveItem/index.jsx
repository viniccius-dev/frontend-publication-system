import { useId } from "react";
import { FiX, FiUpload } from "react-icons/fi";

import { Container } from './styles';

export function ArquiveItem({ isNew, value, fileUrl, onClick, onFileChange, disabled = false, ...rest }) {
    const uniqueId = useId();

    const handleOpenFile = () => {
        if(fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    const handleDisabledClick = (e) => {
        if (disabled) {
            e.preventDefault();
            alert("Você não pode realizar um novo upload enquanto não excluir o atual.");
        }
    };

    return (
        <Container $isNew={isNew}>
            {
                !isNew ?

                <input 
                    type="text"
                    value={value}
                    readOnly={!isNew}
                    onClick={handleOpenFile}
                    {...rest}
                    title={value}
                />

                :

                <label htmlFor={`arquive-${uniqueId}`}>
                    <span>Selecionar um arquivo <FiUpload /></span>
                    <input 
                        id={`arquive-${uniqueId}`}
                        type="file"
                        onChange={onFileChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.ppt,.pptx,.png,.jpg"
                        readOnly={disabled}
                        onClick={handleDisabledClick}
                    />
                </label>
            }

            {
                !isNew &&
                <button
                    type="button"
                    onClick={onClick}
                    className="button-delete"
                >
                    <FiX />
                </button>
            }
        </Container>
    );
}