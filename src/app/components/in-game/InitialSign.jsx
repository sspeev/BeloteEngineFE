
const InitialSign = ({ playerName }) => {
    return (
        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mt-4 bg-secondary-light rounded-full flex items-center justify-center text-black text-3xl md:text-4xl lg:text-6xl font-semibold font-default transform translate-x-4 md:translate-x-6 lg:translate-x-8 z-10">
            {playerName.charAt(0).toUpperCase()}
        </div>
    );
}

export default InitialSign;
