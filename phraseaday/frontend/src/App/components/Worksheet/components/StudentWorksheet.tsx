import React from 'react'
import moment from 'moment'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from 'react-router'

import { Loading, Button, Heading, Paragraph, Table, Breadcrumbs, DropdownMenu, ButtonWrapper, colors } from 'sharedComponents'
import { dateToString, logger } from 'utilities'
import { TWorksheet, TWorksheetEntry, TWorksheetStatus } from 'types'
import styled from 'styled-components'
import { context } from '../..'

const GET_WORKSHEET_AND_WORKSHEET_ENTRIES = gql`
query GetWorksheets($worksheetId: String) {
  worksheet(worksheetId: $worksheetId) {
    title,
    id,
    description,
    date,
    knownLanguage,
    newLanguage,
    userId,
    status,
    user {
      username
    }
  }
  worksheetEntries(worksheetId: $worksheetId) {
   id,
   knownLanguageText,
   newLanguageText,
   audioUrl, 
  }

}
`

const EDIT_WORKSHEET = gql`

mutation editWorksheet (
    $id: String!
    $status: String!
  ) {
    editWorksheet(
        id: $id,
        status: $status,
    ){
      id,
      status
    }
}
`

const DELETE_WORKSHEET_ENTRY = gql`
mutation DeleteWorksheetEntry (
    $id: String!
  ) {
    deleteWorksheetEntry(id: $id){
      id,
    }
}
`

type WorksheetEntryProps = {
    worksheetEntry: TWorksheetEntry
    worksheetStatus: TWorksheetStatus
    worksheetEntries: TWorksheetEntry[]
    setWorksheetEntries: React.Dispatch<React.SetStateAction<TWorksheetEntry[]>>
    worksheet: TWorksheet
}
const WorksheetEntry = ({
    worksheetEntry, worksheetStatus, worksheetEntries, setWorksheetEntries, worksheet
}: WorksheetEntryProps) => {
    const navigate = useNavigate()

    const {
        id, knownLanguageText, newLanguageText, audioUrl,
    } = worksheetEntry

    const [deleteWorksheetEntry] = useMutation<{ addWorksheetEntry: TWorksheetEntry }>(DELETE_WORKSHEET_ENTRY)

    const handleDelete = async () => {
        const modifiedWorksheetEntries = worksheetEntries.filter((worksheetsToFilter) => worksheetsToFilter.id !== id)

        await deleteWorksheetEntry({ variables: { id } })
        setWorksheetEntries(modifiedWorksheetEntries)
    }

    const actions: JSX.Element[] = []

    if (worksheetStatus === TWorksheetStatus.NEW) {
        actions.push(
            <Button
                fullWidth
                key="edit"
                variation="secondary"
                onClick={() => navigate(`/worksheet/${worksheet.id}/${id}/edit`)}
            >Edit
            </Button>
        )
        actions.push(<Button fullWidth key="delete" variation="alert" onClick={handleDelete}>Delete</Button>)
    }

    return (
        <Table.TableRow key={id}>
            <Table.TableBodyCell>{newLanguageText}</Table.TableBodyCell>
            <Table.TableBodyCell>{knownLanguageText}</Table.TableBodyCell>
            <Table.TableBodyCell><audio controls src={audioUrl} /></Table.TableBodyCell>
            {actions.length ? (
                <Table.TableBodyCell>
                    {actions.length > 0
                        ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <DropdownMenu title="Actions">{actions}</DropdownMenu>
                            </div>
                        )
                        : ''}
                </Table.TableBodyCell>
            ) : null}
        </Table.TableRow>
    )
}

const MetadataWrapper = styled.div`
    border: 2px solid;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    border-color: ${colors.PRIMARY.base};
    margin: 0.5rem 0;
`

const Worksheet = () => {
    const { worksheetId } = useParams()
    const [worksheet, setWorksheet] = React.useState<TWorksheet>()
    const [worksheetEntries, setWorksheetEntries] = React.useState<TWorksheetEntry[]>()
    const navigate = useNavigate()
    const [editWorksheet] = useMutation<{ editWorksheet: { status: TWorksheetStatus, id: string } }>(EDIT_WORKSHEET)
    const [isLoading, setIsLoading] = React.useState<boolean>(true)
    const { dispatch } = React.useContext(context)

    useQuery<{ worksheet: TWorksheet[], worksheetEntries: TWorksheetEntry[] }>(GET_WORKSHEET_AND_WORKSHEET_ENTRIES, {
        variables: {
            worksheetId
        },
        onCompleted: (data) => {
            setWorksheet(data.worksheet[0])
            setWorksheetEntries(data.worksheetEntries)
            setIsLoading(false)
        },
        onError: (error) => {
            logger(JSON.stringify(error))
            dispatch({ type: 'HAS_ERRORED' })
        },
    })

    if (isLoading) return <Loading />

    const { title, description, date, id } = worksheet

    const handleSubmit = async () => {
        await editWorksheet({ variables: { status: TWorksheetStatus.NEEDS_REVIEW, id: worksheetId } })
        navigate('/student/dashboard')
    }

    return (
        <div>
            <div>
                <Heading.H2><Breadcrumbs breadcrumbs={[{ to: '/student/dashboard', text: 'Student Dashboard' }]} /> {title} Worksheet</Heading.H2>
                <MetadataWrapper>
                    <Paragraph>
                        Description: {description}
                    </Paragraph>
                    <Paragraph>
                        Date: {dateToString(moment(date))}
                    </Paragraph>
                </MetadataWrapper>
                {worksheet.status === TWorksheetStatus.NEW
                    ? (
                        <ButtonWrapper
                            left={[<Button variation="primary" onClick={() => navigate(`/worksheet/${id}/add`)}>Add Entries</Button>]}
                        />
                    )
                    : null}
                <Table.Table>
                    <Table.TableHeader>
                        <Table.TableRow>
                            <Table.TableHeaderCell width="35%" scope="col">{worksheet.newLanguage}</Table.TableHeaderCell>
                            <Table.TableHeaderCell width="35%" scope="col">{worksheet.knownLanguage}</Table.TableHeaderCell>
                            <Table.TableHeaderCell width="20%" scope="col" style={{ textAlign: 'center' }}>Recorded</Table.TableHeaderCell>
                            {worksheet.status === TWorksheetStatus.NEW
                                ? (<Table.TableHeaderCell style={{ textAlign: 'center' }} width="10%" scope="col">Actions</Table.TableHeaderCell>)
                                : null}
                        </Table.TableRow>
                    </Table.TableHeader>
                    <Table.TableBody>
                        {worksheetEntries.map((worksheetEntry) => (
                            <WorksheetEntry
                                worksheetEntries={worksheetEntries}
                                setWorksheetEntries={setWorksheetEntries}
                                key={worksheetEntry.id}
                                worksheetStatus={worksheet.status}
                                worksheetEntry={worksheetEntry}
                                worksheet={worksheet}
                            />
                        ))}
                    </Table.TableBody>
                </Table.Table>
            </div>
            {worksheet.status === TWorksheetStatus.NEW
                ? (
                    <ButtonWrapper
                        right={[
                            <Button disabled={worksheetEntries.length === 0} variation="secondary" onClick={handleSubmit}>Submit for Feedback</Button>
                        ]}
                    />
                )
                : null}
        </div>
    )
}

export default Worksheet
