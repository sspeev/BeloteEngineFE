import { useGame } from './contexts/GameContext.jsx';
import Error from './components/Error.jsx';
import GameLobby from './components/main/GameLobby.jsx';

const Layout = () => {

    const { error } = useGame();

    if (error) return <Error />;

    return (
        <div className="App flex flex-col w-full min-h-screen justify-between bg-gradient-to-l from-primary-dark to-primary-light">
            <h3 className="inline-block w-min h-min whitespace-nowrap text-left text-white text-lg font-semibold font-default">
                ALFA 0.0.7
            </h3>

            <main>
                {/* <MainRoutes /> */}
                <GameLobby />
            </main>

            <footer className="text-center text-white text-sm font-semibold font-default">
                &copy; Stoyan Peev 2025
            </footer>
        </div>
    );
}

export default Layout;