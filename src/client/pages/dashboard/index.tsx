import { NextPage } from 'next'
import { Layout } from 'antd'
import {
  DragDropContext,
  DropResult,
  resetServerContext
} from 'react-beautiful-dnd'
import { useState } from 'react'
import gql from 'graphql-tag'

import { withApollo } from '../../lib/apollo'
import checkLoggedIn from '../../lib/checkLoggedIn'
import redirect from '../../lib/redirect'
import { NexusGenRootTypes } from '../../../generated'
import Column from '../../components/column/column.component'

import './dashboard.scss'
import { useMutation } from '@apollo/react-hooks'

interface DashboardPageProps {
  user: NexusGenRootTypes['User']
}

const { Header, Content } = Layout

const updateTasksMutation = gql`
  mutation UpdateTasks($tasks: [UpdateTaskInput!]!) {
    updateTasks(data: { tasks: $tasks }) {
      id
      rank
      completed
      description
    }
  }
`

const DashboardPage: NextPage<DashboardPageProps> = ({ user }) => {
  resetServerContext()

  const [updateTasks] = useMutation(updateTasksMutation)

  const [tasks, setTasks] = useState(user.tasks)

  const onDragEnd = async ({ destination, source }: DropResult) => {
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    let newTasks = [...tasks]

    const task = newTasks.splice(source.index, 1)[0]

    task.rank = destination.index + 1

    newTasks.splice(destination.index, 0, task)

    if (source.index < destination.index) {
      for (let i = destination.index - 1; i >= source.index; i--) {
        newTasks[i].rank = newTasks[i].rank - 1
      }
    } else {
      for (let i = destination.index + 1; i <= source.index; i++) {
        newTasks[i].rank = newTasks[i].rank + 1
      }
    }

    newTasks = newTasks.map(task => {
      return {
        id: task.id,
        description: task.description,
        completed: task.completed,
        rank: task.rank
      }
    })

    updateTasks({ variables: { tasks: newTasks } })

    setTasks(newTasks)
  }

  return (
    <Layout>
      <Header className="header">Hello {user.name}!</Header>
      <Content>
        <DragDropContext onDragEnd={onDragEnd}>
          <Column tasks={tasks} />
        </DragDropContext>
      </Content>
    </Layout>
  )
}

DashboardPage.getInitialProps = async (context: any) => {
  const { user } = await checkLoggedIn(context.apolloClient)

  if (!user) {
    redirect(context, '/')
  }

  return { user }
}

export default withApollo(DashboardPage)
