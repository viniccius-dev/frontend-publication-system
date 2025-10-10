import { forwardRef, useState } from 'react';
import { Container } from './styles';
import MaskedInput from 'react-text-mask';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const Input = forwardRef(({ 
    icon: Icon, 
    maskType, 
    background = "default", 
    type = "text", 
    onChange, 
    ...rest 
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [inputValue, setInputValue] = useState(''); // Estado para controlar o valor do input

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        setInputValue(value); // Atualiza o valor do input
        setHasValue(value.length > 0); // Define se o input tem valor
        if (onChange) onChange(e); // Chama a função onChange passada
    };

    const getMask = () => {
        switch (maskType) {
            case 'identification':
                return (inputValue.length <= 7)
                    ? [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
                    : [/\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
            case 'date':
                return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
            case 'time':
                return [/\d/, /\d/, ':', /\d/, /\d/];
            default:
                return null;
        }
    };

    const mask = getMask();
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <Container $background={background}>
            {Icon && <Icon size={20} />}
            {mask ? (
                <MaskedInput
                    mask={mask}
                    guide={false}
                    value={inputValue} // Define o valor controlado
                    onChange={handleInputChange} // Mantém o controle do valor
                    render={(ref, props) => (
                        <input 
                            ref={ref}
                            {...props}
                            type={inputType}
                        />
                    )}
                    {...rest}
                />
            ) : (
                <>
                    <input
                        ref={ref}
                        type={inputType}
                        value={inputValue}
                        onChange={handleInputChange}
                        {...rest}
                    />
                    {isPassword && hasValue && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="visibilityButton"
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </button>
                    )}
                </>
            )}
        </Container>
    );
});
