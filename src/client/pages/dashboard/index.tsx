import { NextPage } from 'next'
import { Layout, Popover } from 'antd'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  DragDropContext,
  DropResult,
  resetServerContext
} from 'react-beautiful-dnd'
import gql from 'graphql-tag'

import { withApollo } from '../../lib/apollo'
import checkLoggedIn from '../../lib/checkLoggedIn'
import redirect from '../../lib/redirect'
import { NexusGenRootTypes } from '../../../generated'

import './dashboard.scss'
import TaskList from '../../components/task-list/task-list.component'
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks'
import Sidebar from '../../components/sidebar/sidebar.component'
import { IClientTask } from '../../utils'
import FloatingActionButton from '../../components/floating-action-button/floating-action-button.component'

interface DashboardPageProps {
  user: NexusGenRootTypes['User']
}

const { Header, Content, Sider, Footer } = Layout

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

export const userCache = gql`
  query {
    user {
      id
      username
      categories {
        id
        name
        tasks {
          id
          date
          description
          rank
          completed
        }
      }
    }
  }
`

const DashboardPage: NextPage<DashboardPageProps> = ({ user }) => {
  // resetServerContext()

  const client = useApolloClient()

  // useEffect(() => {
  //   const subscription = client
  //     .watchQuery({ query: userCache })
  //     .subscribe(({ data }) => {
  //       setUser(data.user)
  //     })
  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [])

  const { query } = useRouter()

  const [allTasks, setAllTasks] = useState<IClientTask[]>([])

  useEffect(() => {
    let newTasks: IClientTask[] = []
    const { categoryId } = query

    user.categories.forEach(({ id, name, tasks }) => {
      if (categoryId && id !== categoryId) return

      tasks.forEach(task => newTasks.push({ ...task, categoryName: name }))
    })

    newTasks = newTasks.sort((a, b) => {
      const newA = new Date(a.date)
      const newB = new Date(b.date)

      return newA > newB ? 1 : newA < newB ? -1 : 0
    })
    // console.log(newTasks)
    setAllTasks(newTasks)
  }, [user, query])

  return (
    <Layout>
      <Sidebar categories={user.categories} />

      <Layout className="layout">
        <Header className="header"></Header>
        <Content className="content">
          <TaskList tasks={allTasks} />
        </Content>
        <Footer>
          <a href="https://www.freepik.com/free-photos-vectors/background">
            Background vector created by freepik - www.freepik.com
          </a>
        </Footer>
      </Layout>

      <FloatingActionButton categories={user.categories} />
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
