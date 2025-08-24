
export default function Welcome({setView}) {
    return (
        <section className="welcome-container relative
        w-full h-full 
        flex flex-col items-center justify-center 
        bg-gradient-to-l from-neutral-800 to-[#454545] 
        ">
            <section className="flex flex-col gap-2 p-10 w-full text-center justify-start">
                <section>
                    <h1 className="main-heading text-[75px] text-white font-semibold font-['Poppins']">
                        Play <span className="inline-block bg-gradient-to-b from-[#003d1a] to-[#29de00] bg-clip-text text-transparent 
                    text-[75px] font-semibold font-['Poppins']"> Belote </span> online
                    </h1>
                    <h1 className="main-heading text-[75px] text-white font-semibold font-['Poppins']"> free with friends</h1>
                </section>
                <section className="buttons-section w-full flex flex-row items-center justify-center gap-10">
                    <button onClick={() => setView('create')} className="cursor-pointer p-4 bg-gradient-to-bl from-[#29de00] to-[#003d1a] rounded-[40px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                        <p className="text-center text-white text-2xl font-semibold font-['Poppins']">Create game</p>
                    </button>
                    <button onClick={() => setView('join')} className="cursor-pointer p-4 pl-10 pr-10 bg-gradient-to-b from-[#29de00]/90 to-[#003d1a] rounded-[40px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.20)]">
                        <p className="text-center text-white text-2xl font-semibold font-['Poppins']">Join game</p>
                    </button>
                </section>
            </section>

            <section className="green-container flex flex-row gap-10
            w-full h-full bg-gradient-to-br from-[#29de00] to-[#003d1a] shadow-[4px_0px_5px_0px_rgba(255,0,0,0.25)] p-20">
                <p className="text-center justify-center text-white text-[41px] font-semibold font-['Poppins'] leading-[45px]">
                    Az shte sum konkurentsiq na Belot.bg. Ako ne vi se davat pari i vi se
                    tsuka s priqteli ste na pravilnoto mqsto! Are mazna i priqtna igra!
                </p>
            </section>
        </section >
    );
}