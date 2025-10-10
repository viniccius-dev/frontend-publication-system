import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt, FaFileArchive, FaFilePowerpoint, FaFileImage } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { Container } from './styles';

export function File({ title, extension, onClick, modeEdit = "false" }) {
    const getIcon = (extension) => {
        switch (extension) {
            case 'pdf':
                return <FaFilePdf />;
            case 'doc':
            case 'docx':
                return <FaFileWord />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel />;
            case 'zip':
                return <FaFileArchive />;
            case 'ppt':
            case 'pptx':
                return <FaFilePowerpoint />;
            case 'png':
            case 'jpg':
                return <FaFileImage />;
            default:
                return <FaFileAlt />;
        }
    };

    return (
        <Container onClick={onClick}>
            {getIcon(extension)}
            <span>{title}</span>
        </Container>
    );
}
