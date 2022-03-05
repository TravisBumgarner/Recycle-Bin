import { User as TFirebaseUser } from 'firebase/auth'
import moment from 'moment'
import React from 'react'

import { TWorksheet, TWorksheetEntry, TPhraseADayUser } from '../../types'

type State = {
    message: string
    worksheets: Record<string, TWorksheet & { user: TPhraseADayUser }>
    worksheetEntries: Record<string, TWorksheetEntry>
    appHydrated: boolean
    currentUser: {
        firebase: TFirebaseUser,
        phraseADay: TPhraseADayUser
    } | null | undefined
}

const EMPTY_STATE: State = {
    message: null,
    worksheets: {},
    worksheetEntries: {},
    appHydrated: false,
    currentUser: undefined
}

const context = React.createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { }
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    })

type HydrateApp = {
    type: 'HYDRATE_APP'
    data: {
        worksheets: (TWorksheet & { user: TPhraseADayUser })[],
        worksheetEntries: TWorksheetEntry[]
    }
}

type UserSignup = {
    type: 'USER_SIGNED_UP'
    data: {
        currentUser: {
            firebase: TFirebaseUser
            phraseADay: TPhraseADayUser
        }
    }
}

type UserLogin = {
    type: 'USER_LOGGED_IN'
    data: {
        currentUser: {
            firebase: TFirebaseUser
            phraseADay: TPhraseADayUser
        }
    }
}

type UserSignedOut = {
    type: 'USER_SIGNED_OUT'
    data: {
        currentUser: null
    }
}

type AddWorksheet = {
    type: 'ADD_WORKSHEET'
    data: {
        worksheet: TWorksheet & { user: TPhraseADayUser }
    }
}

type EditWorksheet = {
    type: 'EDIT_WORKSHEET'
    data: {
        worksheet: TWorksheet & { user: TPhraseADayUser }
    }
}

type DeleteWorksheet = {
    type: 'DELETE_WORKSHEET'
    data: {
        id: string
    }
}

type AddWorksheetEntry = {
    type: 'ADD_WORKSHEET_ENTRY'
    data: {
        worksheetEntry: TWorksheetEntry
    }
}

type DeleteWorksheetEntry = {
    type: 'DELETE_WORKSHEET_ENTRY'
    data: {
        id: string
    }
}

type GetWorksheets = {
    type: 'GET_WORKSHEETS'
    data: {
        worksheets: (TWorksheet & { user: TPhraseADayUser })[],

    }
}

type AddMessage = {
    type: 'ADD_MESSAGE'
    data: {
        message: string
    }
}

type DeleteMessage = {
    type: 'DELETE_MESSAGE'
}

type Action =
    | AddMessage
    | DeleteMessage
    | UserLogin
    | UserSignup
    | UserSignedOut
    | HydrateApp
    | AddWorksheet
    | EditWorksheet
    | DeleteWorksheet
    | GetWorksheets
    | AddWorksheetEntry
    | DeleteWorksheetEntry

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_MESSAGE': {
            return { ...state, message: action.data.message }
        }
        case 'DELETE_MESSAGE': {
            return { ...state, message: '' }
        }
        case 'USER_SIGNED_OUT':
        case 'USER_LOGGED_IN':
        case 'USER_SIGNED_UP': {
            return { ...state, currentUser: action.data.currentUser }
        }
        case 'HYDRATE_APP': {
            const worksheets: Record<string, TWorksheet & { user: TPhraseADayUser }> = {}
            action.data.worksheets.forEach(worksheet => worksheets[worksheet.id] = { ...worksheet })
            const worksheetEntries: Record<string, TWorksheetEntry> = {}
            action.data.worksheetEntries.forEach(worksheetEntry => worksheetEntries[worksheetEntry.id] = { ...worksheetEntry })
            return { ...state, worksheets, worksheetEntries, appHydrated: true }
        }
        case 'GET_WORKSHEETS': {
            const worksheets: Record<string, TWorksheet & { user: TPhraseADayUser }> = {}
            action.data.worksheets.forEach(worksheet => worksheets[worksheet.id] = { ...worksheet })
            return { ...state, worksheets }
        }
        case 'ADD_WORKSHEET':
        case 'EDIT_WORKSHEET': {
            return { ...state, worksheets: { ...state.worksheets, [action.data.worksheet.id]: { ...action.data.worksheet } } }
        }
        case 'DELETE_WORKSHEET': {
            const modifiedWorksheets = { ...state.worksheets }
            delete modifiedWorksheets[action.data.id]
            return { ...state, worksheets: modifiedWorksheets }
        }
        case 'ADD_WORKSHEET_ENTRY': {
            return { ...state, worksheetEntries: { ...state.worksheetEntries, [action.data.worksheetEntry.id]: { ...action.data.worksheetEntry } } }
        }
        case 'DELETE_WORKSHEET_ENTRY': {
            const modifiedWorksheetEntries = { ...state.worksheetEntries }
            delete modifiedWorksheetEntries[action.data.id]
            return { ...state, worksheetEntries: modifiedWorksheetEntries }
        }
        default: {
            console.error("Swallowing action", action)
            return state
        }
    }
}

const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)

    const Provider = context.Provider

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default ResultsContext
export {
    context,
    Action,
}