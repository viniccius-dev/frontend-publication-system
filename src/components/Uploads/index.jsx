import { useState, useCallback } from 'react';

import { Container } from './styles';

import { ArquiveItem } from '../ArquiveItem';
import { toast } from 'react-toastify';

export function Uploads({ onFilesChange, main = false, disabled = false }) {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const pushFile = useCallback((file) => {
        if(!file) return;

        if(file.size <= 30 * 1024 * 1024) { // Check file size (30 MB)
            const fileUrl = URL.createObjectURL(file);
            const newFiles = [...files, { file, fileUrl }];
            setFiles(newFiles);
            onFilesChange(newFiles);
        } else {
            toast.error('Arquivo muito grande. O tamanho máximo é de 30 MB.');
        }
    }, [files, onFilesChange]);

    const handleFileChange = (e) => {
        if(disabled) return;

        const file = e.target.files[0];
        pushFile(file);
    } 

    const handleRemoveFile = (fileName) => {
        const newFiles = files.filter(fileObj => fileObj.file.name !== fileName);
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if(disabled) return;
        const droppedFiles = Array.from(e.dataTransfer.files || []);
        if(droppedFiles.length > 0) {
            // only take first file for this component
            pushFile(droppedFiles[0]);
        }
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if(disabled) return;
        setIsDragging(true);
    };

    return (
        <Container className={isDragging ? 'dragging' : ''} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)}>
            {!files.length && <div className="drop-hint">Arraste o arquivo aqui ou clique em Selecionar arquivo</div>}
            {
                files.map((fileObj, index) => (
                    <ArquiveItem 
                        key={index}
                        value={fileObj.file.name}
                        fileUrl={fileObj.fileUrl}
                        onClick={() => handleRemoveFile(fileObj.file.name)}
                    />
                ))
            }
            {!main || files.length === 0 ? (
                <ArquiveItem 
                    isNew
                    placeholder="Novo arquivo"
                    onFileChange={handleFileChange}
                    disabled={disabled}
                />
            ) : null}
        </Container>
    );
}