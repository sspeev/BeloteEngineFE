import React from 'react';
import { useGame } from '../context/gameContext';

export default function CreateForm({
    handleCreateLobby,
    playerName,
    setPlayerName,
    lobbyName,
    setLobbyName,
    setView
}) {
    const {
        loading
    } = useGame();
    return (
        <section className="create-container 
        w-full h-full relative flex flex-col items-center justify-center">
            <form className="w-sm h-1/2 flex flex-col bg-gradient-to-b from-secondary-light to-secondary-dark rounded-[50px]">

                <label className=" justify-start text-primary-light text-2xl font-semibold font-['Poppins']">Lobby name</label>
                <input className="w-[457px] h-[77px] bg-[#d9d9d9] rounded-[20px]"
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required />

                <label className="w-[170px] h-[18px] text-center justify-start text-primary-light text-2xl font-semibold font-['Poppins']">Player name</label>
                <input className="w-[453px] h-[70px] bg-[#d9d9d9] rounded-[20px]"
                    type="text"
                    placeholder="Enter your name" value={lobbyName}
                    onChange={(e) => setLobbyName(e.target.value)} />

                <section className="button-wrapper flex flex-row gap-10">
                    <button className="w-[203px] h-[71px] bg-gradient-to-l from-[#272727] to-[#464545] rounded-[40px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                        <p className="w-[170px] h-9 text-center justify-start text-white text-2xl font-semibold font-['Poppins']">Create game</p>
                    </button>
                    <button className="w-[203px] h-[71px] bg-gradient-to-b from-[#464545] to-[#272727] rounded-[40px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                        <p className="w-[170px] h-9 text-center justify-start text-white text-2xl font-semibold font-['Poppins']">Back<br /></p>
                    </button>
                </section>
            </form>
        </section>
    );
}
