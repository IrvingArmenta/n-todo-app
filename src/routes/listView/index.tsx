import anime from 'animejs';
import Cookies from 'js-cookie';
import { FunctionalComponent, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import style from './style.css';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import { Transition } from 'react-transition-group';

// components
import Input from '../../components/input';
import TextArea from '../../components/textarea';
import Modal from '../../components/modal';
import AddButton from '../../components/addButton';

type ListViewType = {
  listId: string;
} & RouteComponentProps;

const ListView: FunctionalComponent<ListViewType> = (props) => {
  const { listId } = props;
  const listViewPageRef = useRef<HTMLDivElement>(null);
  const addFormRef = useRef<HTMLDivElement>(null);
  const [toggleModal, setToggleModal] = useState(false);
  const userCookie = Cookies.get('TodoApp-User-Cookie');
  const history = useHistory();

  // フォームデータ
  const [todoTitle, setTodoTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // ログインチェック
  useEffect(() => {
    if (!userCookie) {
      history.push('/');
    }
  }, [history, userCookie]);

  useEffect(() => {
    anime({
      targets: listViewPageRef.current,
      opacity: [0, 1],
      translateX: [32, 0],
      easing: 'easeInOutExpo'
    });
  }, []);

  return (
    <div
      className={`${style.listViewWrapper} app-page centered`}
      ref={listViewPageRef}
    >
      <Modal
        open={toggleModal}
        onModalOpen={() => titleInputRef.current.focus()}
      >
        <Input
          label="リストタイトル"
          setsumei="リストの名前"
          value={todoTitle}
          onInput={(e) => setTodoTitle(e.currentTarget.value)}
          ref={titleInputRef}
          maxLength={16}
          required={true}
        />
        <TextArea
          maxLength={40}
          label="概要"
          value={shortDesc}
          onInput={(e) => setShortDesc(e.currentTarget.value)}
        />
      </Modal>
      <AddButton
        onClick={() => setToggleModal((v) => !v)}
        closeMode={toggleModal}
      />
      <ul>{listId}</ul>
    </div>
  );
};

export default ListView;
