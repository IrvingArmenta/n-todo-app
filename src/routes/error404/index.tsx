import { FunctionalComponent, h } from 'preact';
import { Link } from 'react-router-dom';

const Error404: FunctionalComponent = () => {
  return (
    <div>
      <h1>Error 404</h1>
      <p>That page doesn&apos;t exist.</p>
      <Link to="/">
        <h4>Back to Home</h4>
      </Link>
    </div>
  );
};

export default Error404;
