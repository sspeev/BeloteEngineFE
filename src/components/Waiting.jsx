import { useGame } from "../context/gameContext";

const Waiting = () => {
    const {
        gamephase,
        lobbyName
    } = useGame();

    return (
        <main className="container mx-auto py-8 px-4 flex flex-col items-center">
            <header className="w-full max-w-xs lg:max-w-3xl flex flex-col lg:flex-row justify-between items-center bg-gradient-to-b from-secondary-light to-secondary-dark rounded-xl p-8 mb-10">
                <div className="flex flex-col lg:flex-row gap-3 items-center mb-6 lg:mb-0">
                    <div>
                        <h2 className="text-4xl font-semibold font-default text-primary-light">{lobbyName}</h2>
                        <p className="text-white text-xl font-semibold font-default">{gamephase}</p>
                    </div>
                    <div className="button-wrapper">
                        <button>
                            <p>Leave</p>
                        </button>

                        <button>
                            <p className="text-[#ffee00]">Start</p> 
                        </button>
                    </div>
                </div>

                {/* Right side with title */}
                <div className="text-center text-white text-xs lg:text-4xl font-semibold font-['Poppins'] max-w-lg">
                    BELOTE ENGINE STAGE DEVELOPMENT
                </div>
            </header>

            {/* Teams and players area */}
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 mb-10">
                {/* Team 1 */}
                <div className="flex-1">
                    <div className="bg-[#003d1a] rounded-[30px] p-6 mb-6">
                        <h3 className="text-center text-white text-[32px] font-normal font-['Poppins'] mb-4">Team 1</h3>
                        <div className="text-center text-white text-2xl font-semibold font-['Poppins']">0</div>
                    </div>

                    {/* Team 1 Players */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#d9d9d9] rounded-[29px] p-4 shadow-[0px_0px_4px_4px_rgba(255,238,0,1.00)]">
                            <div className="h-20"></div> {/* Placeholder for player avatar/card */}
                            <div className="text-center text-black text-2xl font-semibold font-['Poppins']">
                                Konstantin<br />connected
                            </div>
                        </div>
                        <div className="bg-[#d9d9d9] rounded-[29px] p-4">
                            <div className="h-20"></div> {/* Placeholder for player avatar/card */}
                            <div className="text-center text-black text-2xl font-semibold font-['Poppins']">
                                Waiting...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team 2 */}
                <div className="flex-1">
                    <div className="bg-[#003d1a] rounded-[30px] p-6 mb-6">
                        <h3 className="text-center text-white text-[32px] font-normal font-['Poppins'] mb-4">Team 2</h3>
                        <div className="text-center text-white text-2xl font-semibold font-['Poppins']">0</div>
                    </div>

                    {/* Team 2 Players */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#d9d9d9] rounded-[29px] p-4">
                            <div className="h-20"></div> {/* Placeholder for player avatar/card */}
                            <div className="text-center text-black text-2xl font-semibold font-['Poppins']">
                                Waiting...
                            </div>
                        </div>
                        <div className="bg-[#d9d9d9] rounded-[29px] p-4">
                            <div className="h-20"></div> {/* Placeholder for player avatar/card */}
                            <div className="text-center text-black text-2xl font-semibold font-['Poppins']">
                                Waiting...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Waiting;