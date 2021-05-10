import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import Button from '../../components/button';
import FlatLogo from '../../assets/img/todo-app-flat-logo.svg';

const Dashboard: FunctionalComponent = () => {
  const [user, setUser] = useState('');

  return (
    <div className={`app-page`}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
      <Button variant="primary">Normal</Button>
      <p>あいちゃんは悪いこ</p>
      <p>{user}</p>
      <FlatLogo width={150} />
      {/* <FlipMove typeName="ul">
        {[
          { id: 'hey', text: 'hey1' },
          { id: 'hey1', text: 'hey2' },
          { id: 'hey2', text: 'hey3' }
        ].map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </FlipMove> */}
    </div>
  );
};

export default Dashboard;
