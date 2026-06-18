import {createContext, useContext, useEffect, useState, useId} from 'react';

export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
      aria-labelledby={id}
    >
      <button className="close-outside" onClick={close} aria-label="Close modal" />
      <aside className="bg-[#FAFAFA] flex flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <h3 id={id} className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">
            {heading}
          </h3>
          <button
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 hover:bg-gray-200"
            onClick={close}
            aria-label="Close"
          >
            <svg 
              className="h-4 w-4 text-black transition-transform duration-500 ease-out group-hover:rotate-90" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto hide-scroll bg-white">
          {children}
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */