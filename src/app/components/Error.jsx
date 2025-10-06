import { useGame } from '../contexts/GameContext.jsx';

const Error = () => {

    const { error } = useGame();
    return (
        <div className="error-container">
            <p>Unexpected error: {error}</p>
            <button onClick={() => window.location.reload()}>
                <p>Retry</p>
            </button>
        </div>
    );
};

export default Error;