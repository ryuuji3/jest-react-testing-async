import React from 'react'
import AsyncButton from './AsyncButton'


function createPromiseWithNestedPromiseAndTimeout(levelsDeep, delayMS) {
    return () => createdNestedPromise(levelsDeep, delayMS)
}

function createdNestedPromise(levelsDeep, delayMS) {
    return levelsDeep > 0 
        ? Promise.resolve(createdNestedPromise(levelsDeep - 1))
        : createPromiseWithDelay(delayMS)
}

function createPromiseWithDelay(delayMS) {
    return new Promise(resolve => {
        setTimeout(resolve, delayMS)
    })
}

function AsyncExampleWithNestedPromises({ levelsDeep = 3, timeout = 2000 }) {
    return (
        <div>
            <h1>Async example with a nested promise and timeout</h1>

            <AsyncButton
                message="Click me"
                callback={createPromiseWithNestedPromiseAndTimeout(levelsDeep, timeout)}
            />
        </div>
    )
}

export default AsyncExampleWithNestedPromises