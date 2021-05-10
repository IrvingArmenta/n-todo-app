import { FunctionalComponent, h } from 'preact';
import style from './style.css';
import { useCallback, useEffect, useState } from 'preact/hooks';
import FlipMove from 'react-flip-move';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../api/db';
import { User } from '../../api/models/user';
import Button from '../../components/button';
import FlatLogo from '../../assets/img/todo-app-flat-logo.svg';

const Home: FunctionalComponent = () => {
  const [user, setUser] = useState('');

  const createUser = useCallback(async () => {
    const id = await db.transaction('rw', db.users, async () => {
      const all = await db.users.toArray();

      const testBud = new User('irving');

      const testBudId = await db.users.put(testBud);

      const getUser = await db.users.get(testBudId);

      setUser(JSON.stringify(getUser));

      return getUser;
    });
    return id;
  }, []);

  useEffect(() => {
    createUser();
  }, []);

  return (
    <div className={`${style.home} app-page`}>
      <h1>Home</h1>
      <p>This is the Home component.</p>
      <Button variant="primary">Normal</Button>
      <p>あいちゃんは悪いこ</p>
      <p>{user}</p>
      <FlatLogo width={150} />
      <FlipMove typeName="ul">
        {[
          { id: 'hey', text: 'hey1' },
          { id: 'hey1', text: 'hey2' },
          { id: 'hey2', text: 'hey3' }
        ].map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </FlipMove>
    </div>
  );
};

export default Home;
