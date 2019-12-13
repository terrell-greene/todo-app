import { NextPage } from 'next'
import { Layout, Icon, Empty, Select } from 'antd'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import { withApollo } from '../../lib/apollo'
import checkLoggedIn from '../../lib/checkLoggedIn'
import redirect from '../../lib/redirect'
import { NexusGenRootTypes } from '../../../generated'
import { IClientTask } from '../../utils'
import FloatingActionButton from '../../components/floating-action-button/floating-action-button.component'
import Task from '../../components/task/task.component'

import './dashboard.scss'
import moment, { Moment } from 'moment'

interface DashboardPageProps {
  user: NexusGenRootTypes['User']
}

const { Header, Content, Footer } = Layout
const { Option } = Select

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
  const dateFormat = 'ddd, MMMM Do'
  const { query } = useRouter()

  const [filteredTasks, setFilteredTasks] = useState<IClientTask[]>([])
  const [filter, setFilter] = useState('all')
  const [currentCategory, setCurrentCategory] = useState('My Day')

  const {
    data: { user }
  } = useQuery<{ user: NexusGenRootTypes['User'] }>(userCache)

  useEffect(() => {
    const { categoryId } = query

    if (!categoryId) {
      setCurrentCategory('My Day')
    } else {
      user.categories.forEach(category => {
        if (categoryId === category.id) {
          setCurrentCategory(category.name)
        }
      })
    }
  }, [query])

  useEffect(() => {
    let newTasks: IClientTask[] = []
    const { categoryId } = query

    user.categories.forEach(({ id, name, tasks }) => {
      if (categoryId && id !== categoryId) return
      const currentDate = Date.now()

      tasks.forEach(task => {
        if (filter === 'complete' && task.completed === true) {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
          return
        } else if (filter === 'incomplete' && task.completed === false) {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
          return
        } else if (filter === 'all') {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
        } else if (
          filter === 'overdue' &&
          moment(task.date).diff(currentDate, 'day') < 0 &&
          !task.completed
        ) {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
        }
      })
    })

    newTasks.sort((a, b) => {
      const newA = new Date(a.date)
      const newB = new Date(b.date)

      return newA > newB ? 1 : newA < newB ? -1 : 0
    })

    setFilteredTasks(newTasks)
  }, [user, query, filter])

  return (
    <Layout>
      <Layout className="layout">
        <Header className="header">
          <h1>{moment(new Date()).format(dateFormat)}</h1>

          <Select
            className="select"
            defaultValue="all"
            onSelect={value => setFilter(value)}
          >
            <Option value="all">Show all</Option>
            <Option value="incomplete">Show incomplete</Option>
            <Option value="complete">Show complete</Option>
            <Option value="overdue">Show overdue</Option>
          </Select>
        </Header>
        <Content className="content">
          {filteredTasks.length === 0 ? (
            <Empty
              className="empty"
              description="All tasks have been completed"
            />
          ) : (
            filteredTasks.map(task => <Task key={task.id} task={task} />)
          )}
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
