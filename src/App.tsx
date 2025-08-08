import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import { addBy, decrement, increment, reset, selectCounterValue } from './store/counterSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';
import viteLogo from '/vite.svg';

function App() {
  const [step, setStep] = useState(1);
  const count = useAppSelector(selectCounterValue);
  const dispatch = useAppDispatch();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Redux Toolkit</h1>
      <div className="card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => dispatch(decrement())}>-</button>
          <span>count is {count}</span>
          <button onClick={() => dispatch(increment())}>+</button>
          <input
            type="number"
            value={step}
            onChange={e => setStep(Number(e.target.value) || 0)}
            style={{ width: 80 }}
          />
          <button onClick={() => dispatch(addBy(step))}>add by</button>
          <button onClick={() => dispatch(reset())}>reset</button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
