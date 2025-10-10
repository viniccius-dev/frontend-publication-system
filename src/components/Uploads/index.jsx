import { useState } from 'react';

import { Container } from './styles';

import { ArquiveItem } from '../ArquiveItem';

export function Uploads({ onFilesChange, main = false, disabled = false }) {
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        if(disabled) return;

        const file = e.target.files[0];
        if(file) {
            if(file.size <= 30 * 1024 * 1024) { // Check file size (30 MB)
                const fileUrl = URL.createObjectURL(file);
                const newFiles = [...files, { file, fileUrl }];
                setFiles(newFiles);
                onFilesChange(newFiles)
            } else {
                alert("Arquivo muito grande. O tamanho máximo é de 30 MB.");
            }
        };
    } 

    const handleRemoveFile = (fileName) => {
        const newFiles = files.filter(fileObj => fileObj.file.name !== fileName);
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    return (
        <Container>
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