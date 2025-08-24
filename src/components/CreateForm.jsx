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
            <article className="w-[570px] h-[437px] bg-gradient-to-b from-[#29de00] to-[#003d1a] rounded-[50px]">
                <div className="w-[457px] h-[77px] bg-[#d9d9d9] rounded-[20px]" />
                <div className="w-[453px] h-[70px] bg-[#d9d9d9] rounded-[20px]" />
                <div className="w-[170px] h-[18px] text-center justify-start text-[#454545] text-2xl font-semibold font-['Poppins']">Lobby name</div>
                <div className="w-[170px] h-[18px] text-center justify-start text-[#454545] text-2xl font-semibold font-['Poppins']">Player name</div>
                <section className="button-wrapper flex flex-row gap-10">
                    <div className="w-[204px] h-[78px] rounded-[50px] overflow-hidden">
                        <div className="w-[203px] h-[71px] bg-gradient-to-l from-[#272727] to-[#464545] rounded-[40px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]" />
                        <div className="w-[170px] h-9 text-center justify-start text-white text-2xl font-semibold font-['Poppins']">Create game</div>
                    </div>
                    <div className="w-[204px] h-[78px] rounded-[50px] overflow-hidden">
                        <div className="w-[203px] h-[71px] bg-gradient-to-b from-[#464545] to-[#272727] rounded-[40px] shadow-[inset_0px_4px_12px_0px_rgba(0,0,0,0.20)]" />
                        <div className="w-[170px] h-9 text-center justify-start text-white text-2xl font-semibold font-['Poppins']">Back<br /></div>
                    </div>
                </section>
            </article>
        </section>
    );
}
