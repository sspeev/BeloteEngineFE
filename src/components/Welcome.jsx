
export default function Welcome({setView}) {
    return (
        <section className="welcome-container relative
        w-full h-full 
        flex flex-col items-center justify-center 
        bg-gradient-to-l from-primary-dark to-primary-light 
        ">
            <section className="flex flex-col gap-2 p-10 w-full text-center justify-start">
                <section>
                    <h1 className="main-heading text-[45px] lg:text-[75px] text-white font-semibold font-default">
                        Play <span className="inline-block bg-gradient-to-b from-secondary-dark to-secondary-light bg-clip-text text-transparent 
                    text-[45px] lg:text-[75px] font-semibold font-default"> Belote </span> online
                    </h1>
                    <h1 className="main-heading text-[45px] lg:text-[75px] text-white font-semibold font-default"> free with friends</h1>
                </section>
                <section className="button-wrapper">
                    <button onClick={() => setView('create')} 
                    className="p-2 bg-gradient-to-b from-secondary-light to-secondary-dark rounded-[40px] shadow-default">
                        <p>Create game</p>
                    </button>
                    <button onClick={() => setView('join')} 
                    className="p-2 bg-gradient-to-b from-secondary-light/90 to-secondary-dark rounded-[40px] shadow-default">
                        <p>Join game</p>
                    </button>
                </section>
            </section>

            <section className="green-container flex flex-row gap-10
            w-full h-full bg-gradient-to-br from-secondary-light to-secondary-dark p-20">
                <p className="text-center justify-center text-white text-[41px] font-semibold font-default leading-[45px]">
                    Az shte sum konkurentsiq na Belot.bg. Ako ne vi se davat pari i vi se
                    tsuka s priqteli ste na pravilnoto mqsto! Are mazna i priqtna igra!
                </p>
            </section>
        </section >
    );
}