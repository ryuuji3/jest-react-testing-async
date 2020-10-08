import React from 'react'
import AsyncButton from './AsyncButton'


function createPromiseWithDelay(delayMS) {
    return () => new Promise(resolve => {
        setTimeout(resolve, delayMS)
    })
}

function AsyncExampleWithTimeout({ timeout = 2000 }) {
    return (
        <div>
            <h1>Async example with a timeout</h1>

            <AsyncButton
                message="Click me"
                callback={createPromiseWithDelay(timeout)}
            />
        </div>
    )
}

export default AsyncExampleWithTimeout