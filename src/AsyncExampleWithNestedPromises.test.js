import React from 'react'

import {
    render,
    act,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AsyncExampleWithNestedPromises from './AsyncExampleWithNestedPromises'


async function flushAllPromises() {
    await act(async () => {
        for (let promises = 0; promises <= 10; promises++) {
            await new Promise(resolve => setImmediate(resolve))
        }
    })
}

/**
 * If we assume events should always be async and flush promises
 * 
 * @param {HTMLButtonElement} button
 * 
 * @returns {Promise<void>}
 */
async function clickButtonAsync(button) {
    await act(async () => {
        userEvent.click(button)
        await flushAllPromises()
    })
}

/**
 * Sync as default, promises must be flushed manually
 * 
 * @param {HTMLButtonElement} button 
 * 
 * @returns {void}
 */
function clickButtonSync(button) {
    userEvent.click(button)
}

test('Renders loading message when clicked (sync click button)', async () => {
    const { getByRole } = render(<AsyncExampleWithNestedPromises levelsDeep={3} />)
    const button = getByRole('button', {
        label: /click me/i,
    })

    clickButtonSync(button)

    expect(button).toHaveTextContent(/loading/i)

    await flushAllPromises()

    await waitFor(() => expect(button).toHaveTextContent(/done/i))
})

// Unable to test if button is in loading state because the promises are flushed
test.skip('Renders loading message when clicked (async click button)', async () => {
    const { getByRole } = render(<AsyncExampleWithNestedPromises levelsDeep={3} />)
    const button = getByRole('button', {
        label: /click me/i,
    })

    await clickButtonAsync(button)

    expect(button).toHaveTextContent(/loading/i)

    await waitFor(() => expect(button).toHaveTextContent(/done/i))
})