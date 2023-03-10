import React from 'react'
import { useMutation, gql, useQuery } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate, useParams } from 'react-router'

import { AudioRecorder, Breadcrumbs, Button, ButtonWrapper, Heading, LabelAndInput, Loading } from 'sharedComponents'
import styled from 'styled-components'
import { TWorksheet, TWorksheetEntry } from 'types'
import { context } from 'context'
import { logger, objectUrlToBase64 } from 'utilities'

const GET_WORKSHEETS = gql`
query GetWorksheets($worksheetId: String!) {
    worksheet(worksheetId: $worksheetId) {
        id,
        newLanguage,
        knownLanguage,
        title,
        description
    }
}
`

const ADD_WORKSHEET_ENTRY = gql`

mutation AddWorksheetEntry (
    $knownLanguageText: String!
    $newLanguageText: String!
    $id: String!
    $worksheetId: String!
    $audioUrl: String!
  ) {
    addWorksheetEntry(
        id: $id,
        worksheetId: $worksheetId,
        knownLanguageText: $knownLanguageText,
        newLanguageText: $newLanguageText,
        audioUrl: $audioUrl
    ){
      id,
      knownLanguageText,
      newLanguageText,
      worksheetId,
      audioUrl
    }
}
`

const WrittenWrapper = styled.div`
display: flex;
flex-direction: row;

> div {
    width: 50%;
}
`

const AddWorksheetEntry = () => {
    const [addWorksheetEntry] = useMutation<{ addWorksheetEntry: TWorksheetEntry }>(ADD_WORKSHEET_ENTRY)
    const [knownLanguageText, setKnownLanguageText] = React.useState<string>('')
    const [newLanguageText, setNewLanguageText] = React.useState<string>('')
    const [worksheet, setWorksheet] = React.useState<TWorksheet>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const { dispatch } = React.useContext(context)
    const [audioUrl, setAudioUrl] = React.useState<string>('')
    const { worksheetId } = useParams()
    const navigate = useNavigate()

    useQuery<{ worksheet: TWorksheet[] }>(GET_WORKSHEETS, {
        variables: {
            worksheetId
        },
        onCompleted: (data) => {
            setWorksheet(data.worksheet[0])
            setIsLoading(false)
        },
        onError: (error) => {
            logger(JSON.stringify(error))
            dispatch({ type: 'HAS_ERRORED' })
        },
    })

    const handleSubmit = async () => {
        setIsLoading(true)
        const base64Audio = audioUrl.length ? await objectUrlToBase64(audioUrl) : ''
        const newWorksheetEntry: TWorksheetEntry = {
            knownLanguageText,
            newLanguageText,
            id: uuidv4(),
            worksheetId: worksheet.id,
            audioUrl: base64Audio as string,
        }
        const response = await addWorksheetEntry({
            variables: newWorksheetEntry,
        })

        if (response.data.addWorksheetEntry === null) {
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Failed to submit worksheet entry', timeToLiveMS: 5000 } })
        } else {
            setKnownLanguageText('')
            setNewLanguageText('')
            setAudioUrl('')
            dispatch({ type: 'ADD_MESSAGE', data: { message: 'Submitted!', timeToLiveMS: 3000 } })
        }
        setIsLoading(false)
    }

    const handleClose = () => {
        navigate(`/worksheet/${worksheetId}`)
    }

    if (isLoading) return <Loading />
    const breadcrumbs = [
        { text: 'User Dashboard', to: '/student/dashboard' },
        { text: `${worksheet.title} Worksheet`, to: `/worksheet/${worksheetId}` },
    ]

    const hasUserFilledEntry = (knownLanguageText.length || newLanguageText.length || audioUrl.length)

    return (
        <div>
            <Heading.H2><Breadcrumbs breadcrumbs={breadcrumbs} /> New Entry</Heading.H2>
            <div>
                <WrittenWrapper>
                    <LabelAndInput
                        label={worksheet.newLanguage}
                        name="newLanguage"
                        value={newLanguageText}
                        handleChange={(newLanguage) => setNewLanguageText(newLanguage)}
                        type="textarea"
                    />
                    <LabelAndInput
                        label={worksheet.knownLanguage}
                        name="fromLanguage"
                        value={knownLanguageText}
                        handleChange={(knownLanguage) => setKnownLanguageText(knownLanguage)}
                        type="textarea"
                    />
                </WrittenWrapper>

                <div>
                    <AudioRecorder
                        audioUrl={audioUrl}
                        setAudioUrl={setAudioUrl}
                    />
                </div>

                <ButtonWrapper
                    right={[
                        <Button disabled={isLoading} variation="primary" onClick={handleClose}>Close</Button>,
                        <Button disabled={isLoading || !hasUserFilledEntry} variation="secondary" onClick={handleSubmit}>Submit Entry</Button>
                    ]}
                />
            </div>
        </div>
    )
}

export default AddWorksheetEntry
