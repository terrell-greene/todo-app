import { NextPage } from 'next'
import { Layout } from 'antd'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import { withApollo } from '../../lib/apollo'
import checkLoggedIn from '../../lib/checkLoggedIn'
import redirect from '../../lib/redirect'
import { NexusGenRootTypes } from '../../../generated'
import Sidebar from '../../components/sidebar/sidebar.component'
import { IClientTask } from '../../utils'
import FloatingActionButton from '../../components/floating-action-button/floating-action-button.component'
import Task from '../../components/task/task.component'

import './dashboard.scss'

interface DashboardPageProps {
  user: NexusGenRootTypes['User']
}

const { Header, Content, Footer } = Layout

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

const DashboardPage: NextPage<DashboardPageProps> = () => {
  const { query } = useRouter()

  const [filteredTasks, setFilteredTasks] = useState<IClientTask[]>([])

  const {
    data: { user }
  } = useQuery(userCache)

  useEffect(() => {
    let newTasks: IClientTask[] = []
    const { categoryId } = query

    user.categories.forEach(({ id, name, tasks }) => {
      if (categoryId && id !== categoryId) return

      tasks.forEach(task =>
        newTasks.push({ ...task, categoryName: name, categoryId: id })
      )
    })

    newTasks = newTasks.sort((a, b) => {
      const newA = new Date(a.date)
      const newB = new Date(b.date)

      return newA > newB ? 1 : newA < newB ? -1 : 0
    })

    setFilteredTasks(newTasks)
  }, [user, query])

  return (
    <Layout>
      <Sidebar />

      <Layout className="layout">
        <Header className="header"></Header>
        <Content className="content">
          {filteredTasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </Content>
        <Footer className="footer">
          <a
            href="https://www.freepik.com/free-photos-vectors/background"
            target="_blank"
          >
            Background vector created by freepik - www.freepik.com
          </a>
        </Footer>
      </Layout>

      <FloatingActionButton />
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
