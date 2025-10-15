
const InitialSign = ({ playerName }) => {
    return (
        <div className="w-10 h-10 md:w-14 md:h-14 lg:w-18 lg:h-18 bg-secondary-light rounded-full flex items-center 
        justify-center text-black text-xl md:text-2xl lg:text-4xl font-semibold font-default m-2
         z-10">
            {playerName.charAt(0).toUpperCase()}
        </div>
    );
}

export default InitialSign;
