import { AddButton } from '@components';
import { clsx } from '@utils';
import type { FunctionalComponent } from 'preact';
import type { Dispatch, StateUpdater } from 'preact/hooks';
import type { TODOS_FILTERS } from '.';
import style from './style.module.css';

const filtersArr = ['hideOnGoing', 'hideDone', 'showAll'] as const;

const ListViewFooter: FunctionalComponent<{
  setCurrentFilter: Dispatch<StateUpdater<TODOS_FILTERS>>;
  currentFilter: TODOS_FILTERS;
  setFormMode: Dispatch<StateUpdater<'CREATE' | 'EDIT'>>;
  setToggleModal: Dispatch<StateUpdater<boolean>>;
  toggleModal: boolean;
}> = (properties) => {
  const {
    setCurrentFilter,
    currentFilter,
    setFormMode,
    setToggleModal,
    toggleModal
  } = properties;
  return (
    <footer
      style={{
        justifyContent: 'space-between ',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div className={style.filtersWrap}>
        <h4>フィルター</h4>
        <span>
          {filtersArr.map((type) => {
            return (
              <button
                key={type}
                type="button"
                className={clsx(
                  type === currentFilter.type && style.active,
                  'pixel-border'
                )}
                onClick={() => setCurrentFilter({ type })}
              >
                {type === 'hideOnGoing' && '完了'}
                {type === 'hideDone' && 'まだ'}
                {type === 'showAll' && '全部'}
              </button>
            );
          })}
        </span>
      </div>
      <AddButton
        onClick={() => {
          setFormMode('CREATE');
          setToggleModal((v) => !v);
        }}
        closeMode={toggleModal}
      />
    </footer>
  );
};

export default ListViewFooter;
