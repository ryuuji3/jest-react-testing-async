import React from 'react'

import {
    render,
    act,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AsyncExampleWithNestedPromisesAndTimeout from './AsyncExampleWithNestedPromisesAndTimeout'


async function waitForFakeTime(ms) {
    await act(async () => {
        jest.runAllImmediates();
        jest.advanceTimersByTime(ms);
        jest.runAllTicks();

        await flushAllPromises()
    })
}

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


describe('When time is faked', () => {
    beforeAll(() => {
        jest.useFakeTimers()
    })

    test('Renders loading message when clicked (sync click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithNestedPromisesAndTimeout timeout={2000} levelsDeep={3} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        clickButtonSync(button)
    
        expect(button).toHaveTextContent(/loading/i)
    
        await waitForFakeTime(2000)
    
        expect(button).toHaveTextContent(/done/i)
    })
    
    test('Renders loading message when clicked (async click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithNestedPromisesAndTimeout timeout={2000} levelsDeep={3} />)
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
        const { getByRole } = render(<AsyncExampleWithNestedPromisesAndTimeout timeout={500} levelsDeep={3} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        clickButtonSync(button)
    
        expect(button).toHaveTextContent(/loading/i)

        await waitFor(() => expect(button).toHaveTextContent(/done/i))
    })
    
    // Cannot gaurantee that promise isn't resolved because time is not mocked
    test.skip('Renders loading message when clicked (async click button)', async () => {
        const { getByRole } = render(<AsyncExampleWithNestedPromisesAndTimeout timeout={500} levelsDeep={3} />)
        const button = getByRole('button', {
            label: /click me/i,
        })
    
        await clickButtonAsync(button)
    
        expect(button).toHaveTextContent(/loading/i)

        await waitFor(() => expect(button).toHaveTextContent(/done/i))
    })
})