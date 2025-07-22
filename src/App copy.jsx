import { useEffect, useState } from 'react';

const Card = ({ title }) => {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    console.log(`${title} has been liked: ${hasLiked}`);
  }, [hasLiked]);

  return (
    <div className="card" onClick={() => setCount(count + 1)}>
      <h2>{title} <br /> {count || null}</h2>

      <button onClick={() => setHasLiked(!hasLiked)}>
        <span>{hasLiked ? '❤️' : '🤍'}</span>
      </button>
    </div>
  );
}

const App = () => {
  return (
    <div className="card-container">
      <Card title="Star wars" />
      <Card title="Avater" />
      <Card title="Titanic" />
      <Card title="The Lion King" />

    </div>
  );
}

export default App
