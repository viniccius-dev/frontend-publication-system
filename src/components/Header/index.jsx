// import { useNavigate } from 'react-router-dom';

// import { Container, Menu } from "./styles";
// import { Button } from "../Button";

// import { FaArrowLeft, FaList, FaPlus } from "react-icons/fa";

// export function Header({ title, onOpenMenu }) {
//     const navigate = useNavigate();

//     function handleBack() {
//         navigate(-1);
//     }

//     function handleLinkClick() {
//        navigate("/create-publication");
//     }

//     return (
//         <Container>
//             <Menu onClick={onOpenMenu}>
//                 <FaList />
//             </Menu>

//             <h1>{title}</h1>

//             {
//                 title !== "Publicações"
//                 ?
//                 <Button icon={FaArrowLeft} title="Voltar" onClick={handleBack} />
//                 :
//                 <Button icon={FaPlus} title="Adicionar Publicação" onClick={handleLinkClick} />
//             }
            
//         </Container>
//     );
// }



import { useNavigate } from 'react-router-dom';
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
        <header className="
            h-full flex items-center justify-between gap-4
            mx-6 py-4 border-b border-[#E0E0E0]
        ">
            {/* Menu Button - Mobile Only */}
            <button
                onClick={onOpenMenu}
                className="
                    flex items-center justify-center
                    bg-transparent border-0 p-2 -ml-2
                    text-[#2D2D2D] text-xl xs:text-2xl
                    transition-all duration-150 ease-out
                    hover:text-[#7DD3E8] hover:scale-105
                    active:scale-95
                    md:hidden
                "
            >
                <FaList />
            </button>

            {/* Title */}
            <h1 className="
                flex-1 text-2xl font-bold text-[#2D2D2D]
                px-4 md:px-0 md:pr-4
                truncate
            ">
                {title}
            </h1>

            {/* Action Button */}
            {title !== "Publicações" ? (
                <button
                    onClick={handleBack}
                    className="
                        flex items-center justify-center gap-2
                        max-w-[230px] min-h-[3rem] px-6 py-3
                        rounded-xl bg-[#7DD3E8] text-[#2D2D2D]
                        shadow-sm
                        transition-all duration-150 ease-out
                        hover:bg-[#6BC4D9] hover:shadow-md hover:-translate-y-0.5
                        active:translate-y-0 active:shadow-sm
                        font-semibold text-sm
                    "
                >
                    <FaArrowLeft />
                    <span className="hidden sm:inline">Voltar</span>
                </button>
            ) : (
                <button
                    onClick={handleLinkClick}
                    className="
                        flex items-center justify-center gap-2
                        max-w-[230px] min-h-[3rem] px-6 py-3
                        rounded-xl bg-[#7DD3E8] text-[#2D2D2D]
                        shadow-sm
                        transition-all duration-150 ease-out
                        hover:bg-[#6BC4D9] hover:shadow-md hover:-translate-y-0.5
                        active:translate-y-0 active:shadow-sm
                        font-semibold text-sm
                    "
                >
                    <FaPlus />
                    <span className="hidden sm:inline">Adicionar Publicação</span>
                </button>
            )}
        </header>
    );
}