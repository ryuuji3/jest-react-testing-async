import React from 'react'

import {
    render,
    act,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AsyncExampleWithTimeout from './AsyncExampleWithTimeout'

// based on this discussion:
// https://stackoverflow.com/questions/51126786/jest-fake-timers-with-promises
async function waitForFakeTime(ms) {
    // Needs to be wrapped in a promise to allow microtask queue to flush prior
    // to executing. This "fakes" a task yield (closer to real timeout).
    Promise.resolve().then(() => {
        act(() => {
            jest.runAllImmediates();
            jest.advanceTimersByTime(ms);
            jest.runAllTicks();
        })        
    });
    
    // Wait here until jest advances the timers by our desired amount
    // Doing the await will allow any queued microtasks to run before we resolve
    // the setTimeout
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function flushAllPromises() {
    for (let promises = 0; promises <= 10; promises++) {
        await new Promise(resolve => setImmediate(resolve))
    }
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


describe('When time is faked', () => {
    beforeAll(() => {
        jest.useFakeTimers()
    })

    test('Renders loading message when clicked (sync click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithTimeout timeout={2000} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        clickButtonSync(button)
    
        expect(button).toHaveTextContent(/loading/i)
    
        await waitForFakeTime(2000)
    
        expect(button).toHaveTextContent(/done/i)
    })
    
    test('Renders loading message when clicked (async click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithTimeout timeout={2000} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        await clickButtonAsync(button)
    
        expect(button).toHaveTextContent(/loading/i)
    
        await waitForFakeTime(2000)
    
        expect(button).toHaveTextContent(/done/i)
    })

    afterAll(() => {
        jest.useRealTimers()
    })
})

describe('When time is not faked', () => {
    test('Renders loading message when clicked (sync click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithTimeout timeout={500} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        clickButtonSync(button)
    
        expect(button).toHaveTextContent(/loading/i)

        await waitFor(() => expect(button).toHaveTextContent(/done/i))
    })
    
    test('Renders loading message when clicked (async click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithTimeout timeout={500} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        await clickButtonAsync(button)
    
        expect(button).toHaveTextContent(/loading/i)

        await waitFor(() => expect(button).toHaveTextContent(/done/i))
    })
})