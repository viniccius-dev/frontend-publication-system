export function Button({ title, loading = false, background = "default", icon: Icon, type = 'button', ...rest }) {
    return (
        <button
            type={type}
            disabled={loading}
            className={`
                w-full min-h-[3.5rem] px-6 py-3 mt-4
                rounded-xl font-bold text-base
                flex items-center justify-center gap-3
                transition-all duration-200 ease-out
                relative overflow-hidden
                ${background === "default" 
                    ? `bg-gradient-to-r from-[#7DD3E8] to-[#5FC4DB] 
                       text-[#1A1A1A] 
                       shadow-lg shadow-cyan-500/30
                       hover:shadow-xl hover:shadow-cyan-500/40
                       hover:from-[#6BC4D9] hover:to-[#4DB5CC]
                       active:shadow-md active:shadow-cyan-500/30` 
                    : `bg-gradient-to-r from-[#2D2D2D] to-[#1A1A1A]
                       text-white
                       shadow-lg shadow-black/40
                       hover:shadow-xl hover:shadow-black/50
                       hover:from-[#3D3D3D] hover:to-[#2A2A2A]
                       active:shadow-md active:shadow-black/40`
                }
                ${loading 
                    ? 'opacity-70 cursor-not-allowed scale-100' 
                    : 'hover:scale-[1.02] active:scale-[0.98]'
                }
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                before:absolute before:inset-0 before:bg-white/10 before:opacity-0
                hover:before:opacity-100 before:transition-opacity before:duration-200
            `}
            {...rest}
        >
            {Icon && (
                <Icon className={`
                    text-lg transition-transform duration-200
                    ${!loading && 'group-hover:scale-110'}
                `} />
            )}
            <span className="relative z-10 tracking-wide">
                {loading ? 'Carregando...' : title}
            </span>
        </button>
    );
}