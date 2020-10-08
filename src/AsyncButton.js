import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './AsyncButton.css'


function AsyncButton({ message, doneMessage, loadingMessage, errorMessage, callback, type }) {
    const [ loading, setLoading ] = useState(false)
    const [ done, setDone ] = useState(false)
    const [ error, setError ] = useState(null)
    
    async function handleClick() {
        setLoading(true)

        try {
            await callback?.()
            setLoading(false)
            setDone(true)
            setError(null)
        } catch(e) {
            console.error(e)
            setLoading(false)
            setError(e)
        }
    }

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={loading}
            className={classNames({
                done,
                error,
            })}
        >
            {loading
                ? loadingMessage
                : error
                    ? errorMessage
                    : done
                        ? doneMessage
                        : message
            }
        </button>
    )
}

function classNames(classes) {
    return Object.entries(classes).reduce((result, [ className, isApplied ]) => {
        if (isApplied) {
            return `${result} ${className}`
        }

        return result
    }, '')
}

AsyncButton.propTypes = {
    message: PropTypes.string.isRequired,
    loadingMessage: PropTypes.string,
    onClick: PropTypes.func,
    type: PropTypes.string,
}

AsyncButton.defaultProps = {
    onClick: undefined,
    loadingMessage: 'Loading...',
    errorMessage: 'Try again!',
    doneMessage: 'Done!',
    type: "button"
}

export default AsyncButton