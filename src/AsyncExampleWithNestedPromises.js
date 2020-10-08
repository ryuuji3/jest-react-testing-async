import React from 'react'
import AsyncButton from './AsyncButton'


function createPromiseWithNestedPromise(levelsDeep) {
    return () => createdNestedPromise(levelsDeep)
}

function createdNestedPromise(levelsDeep) {
    return levelsDeep > 0 
        ? Promise.resolve(createdNestedPromise(levelsDeep - 1))
        : void(null)
}

function AsyncExampleWithNestedPromises({ levelsDeep = 3 }) {
    return (
        <div>
            <h1>Async example with a nested promise</h1>

            <AsyncButton
                message="Click me"
                callback={createPromiseWithNestedPromise(levelsDeep)}
            />
        </div>
    )
}

export default AsyncExampleWithNestedPromises