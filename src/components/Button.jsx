export default function Button({children, onClick, selected}) {
    return (
        <button onClick={onClick}
                className={`${selected ? 'bg-gray-200 border border-blue-300 rounded-lg px-1 py-2' : 'px-1 py-2'}`}>
            {children}
        </button>
    )
}