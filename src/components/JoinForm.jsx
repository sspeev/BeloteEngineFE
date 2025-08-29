

const JoinForm = ({ handleJoinLobby, playerName, setPlayerName, selectedLobbyId, setSelectedLobbyId, availableLobbies, refreshLobbies, loading }) => {
    return (
    <div className="join-container flex flex-col items-center justify-center h-screen">
        <form onSubmit={handleJoinLobby} 
        className="w-[200px] lg:w-[400px]  p-3 flex flex-col bg-gradient-to-b from-secondary-light to-secondary-dark rounded-3xl">
            <div className="w-[231px] h-[113px] left-[478px] top-[634px] absolute bg-[#d9d9d9] rounded-[20px]" />
            <div className="w-[204px] h-[78px] left-[505px] top-[477px] absolute rounded-[50px] overflow-hidden">
                <div className="w-[203px] h-[71px] left-[1px] top-[6px] absolute bg-gradient-to-l from-[#272727] to-[#464545] rounded-[40px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]" />
                <div className="w-[170px] h-9 left-[17px] top-[24px] absolute text-center justify-start text-white text-2xl font-semibold font-['Poppins']">Refresh</div>
            </div>
            <div className="w-[89px] h-[39px] left-[608px] top-[698px] absolute overflow-hidden">
                <div className="w-[90px] h-[33px] left-[4px] top-[6px] absolute bg-gradient-to-l from-[#272727] to-[#464545] rounded-[20px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]" />
                <div className="w-[94px] h-9 left-0 top-[12px] absolute text-center justify-start text-white text-[15px] font-semibold font-['Poppins']">Join</div>
            </div>
            <div className="w-[204px] h-[78px] left-[776px] top-[480px] absolute rounded-[50px] overflow-hidden">
                <div className="w-[203px] h-[71px] left-[1px] top-[6px] absolute bg-gradient-to-b from-[#464545] to-[#272727] rounded-[40px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]" />
                <div className="w-[170px] h-9 left-[17px] top-[24px] absolute text-center justify-start text-white text-2xl font-semibold font-['Poppins']">Back<br /></div>
            </div>
            <div className="w-[453px] h-[70px] left-[516px] top-[376px] absolute bg-[#d9d9d9] rounded-[20px]" />
            <div className="w-[170px] h-[18px] left-[520px] top-[342px] absolute text-center justify-start text-[#454545] text-2xl font-semibold font-['Poppins']">Player name</div>
            <div className="w-[245px] h-10 left-[615px] top-[578px] absolute text-center justify-start text-[#464545] text-2xl font-semibold font-['Poppins']">Available Lobbies</div>
            <div className="w-[150px] h-[25px] left-[519px] top-[649px] absolute text-center justify-start text-black text-2xl font-semibold font-['Poppins']">Players: 1/4</div>
        </form>
    </div>
    );
}

export default JoinForm;