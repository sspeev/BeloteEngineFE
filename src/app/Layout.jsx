import { useGame } from './contexts/GameContext.jsx';
import Error from './components/Error.jsx';
import GameLobby from './components/main/GameLobby.jsx';

const Layout = () => {

    const { error } = useGame();

    if (error) return <Error />;

    return (

        <div className="App h-full bg-gradient-to-l from-primary-dark to-primary-light">
            <h3 className="text-left justify-start text-white text-xl font-semibold font-default leading-[45px]">ALFA 0.0.7</h3>
            <GameLobby />
            <footer>
                <p className="text-center justify-start text-white text-sm font-semibold font-default">&copy; Stoyan Peev 2025</p>
            </footer>
        </div>
    );
}

export default Layout;