'use client'; // required for client-side effects

import { useState } from 'react';

export default function DelayedFetchDemo() {

  const [counter, setCounter] = useState(0)
  // Simulated fetch with 2-minute delay
  const delayedFetchSimulation = () =>
    new Promise<any>((resolve) => {
      // console.log('I am resolver')
      // setTimeout(() => {
      //   resolve('✅ Fetched data after 10 seconds');
      // }, 2000)
      setTimeout(() => {
        fetch('https://randomuser.me/api/')
          // .then((data) => data.json())
          .then(resolve)
      }, 2000)
      
      // .then((res) => res.json())
      // .then((data) => {
      //   const user = data.results[0];
      //   const result = `✅ Fetched: ${user.name.first} ${user.name.last}, ${user.email}`;
      //   resolve(result);
      // });
    });

  // 1. Plain Promise
  const examplePromise = () => {
    console.log('🚀 [Promise] Start request');
    delayedFetchSimulation()
      .then((result) => {
        console.log('🟢 [Promise] Got result:', result);
      });
    console.log('📦 [Promise] Request sent, moving on...');
  };

  // console.log(delayedFetchSimulation().then(data => {
  //   console.log(1+1000000)
  //   console.log({data})
  // }))

  // 2. fetch().then(...)
  const exampleThen = () => {
    console.log('🚀 [then] Start fetch');
    delayedFetchSimulation()
      .then((response) => {
        console.log('🟢 [then] Got response:', response);
      })
      .then((response) => {
        console.log('🟢 [then2] Got response2:', response);
      })
      .then((response) => {
        console.log('🟢 [then3] Got response3:', response);
      })
      .catch((err) => {
        console.log('🔴 [then] Error:', err);
      });
    console.log('📦 [then] Fetch triggered, not waiting...');
  };

  // 3. async/await
  const exampleAsyncAwait = async () => {
    console.log('🚀 [async/await] Start fetch');
    try {

      const response1 =  delayedFetchSimulation();
      const response2 =  delayedFetchSimulation();
      const response3 =  delayedFetchSimulation();
      const response4 =  delayedFetchSimulation();
      const response5 =  delayedFetchSimulation();
      const response6 =  delayedFetchSimulation();

      const res1 = await response1;
      const res2 = await response2;
      const res3 = await response3;
      const res4 = await response4;
      const res5 = await response5;
      const res6 = await response6;

      const result1 = await res1.json()
      const result2 = await res2.json()
      const result3 = await res3.json()
      const result4 = await res4.json()
      const result5 = await res5.json()
      const result6 = await res6.json()

      console.log('🟢 [async/await] Got responses:', {result1, result6});

      //   const responses = await Promise.all([
      //   delayedFetchSimulation(),
      //   delayedFetchSimulation(),
      //   delayedFetchSimulation(),
      //   delayedFetchSimulation(),
      //   delayedFetchSimulation(),
      //   delayedFetchSimulation(),
      // ]);

      // const results = await Promise.all(responses.map(r => r.json()));

      // console.log('🟢 Parallel result:', results);


      // const response1 = await delayedFetchSimulation();
      // const response2 = await delayedFetchSimulation();
      // const response3 = await delayedFetchSimulation();
      // const response4 = await delayedFetchSimulation();
      // const response5 = await delayedFetchSimulation();
      // const response6 = await delayedFetchSimulation();

      // const res1 = await response1.json()
      // const res2 = await response2.json()
      // const res3 = await response3.json()
      // const res4 = await response4.json()
      // const res5 = await response5.json()
      // const res6 = await response6.json()

      // console.log('🟢 [async/await] Got responses:', {res1, res2, res3, res4, res5, res6});
    } catch (err) {
      console.log('🔴 [async/await] Error:', err);
    }
    console.log('📦 [async/await] After await');
  };

  const handleRunAll = async () => {
     examplePromise();
     exampleThen();
     exampleAsyncAwait();
    console.log('⏱️ All requests triggered. JS is NOT waiting for  10 seconds.');
  };

  function increment() {
    setCounter(prev => prev+1)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delayed Fetch Demo</h1>
      <p className="mb-4">Click the button to start three simulated 2-minute fetches. Open the browser console to see the logs.</p>
      <button
        onClick={handleRunAll}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        Run All Delayed Requests
      </button>
      <div className='flex flex-col w-[200px] h-[200px] bg-slate-500'>
        <button onClick={() => increment()}>Run Interval</button>
        <p className='text-[16px]'>{counter}</p>
      </div>
    </div>
  );
}
