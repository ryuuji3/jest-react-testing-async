import React from 'react';
import AsyncExampleWithNestedPromises from './AsyncExampleWithNestedPromises';

import AsyncExampleWithTimeout from './AsyncExampleWithTimeout'

function App() {
  return (
    <div className="App">
        <AsyncExampleWithTimeout />
        <AsyncExampleWithNestedPromises />
    </div>
  );
}

export default App;
