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
import Sidebar from '../../components/sidebar/sidebar.component'
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
  const [selectedDate, setSelectedDate] = useState(new Date())

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

      tasks.forEach(task => {
        if (moment(task.date).date() !== moment(selectedDate).date()) return
        console.log(task.completed)
        if (filter === 'complete' && task.completed === true) {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
          return
        } else if (filter === 'incomplete' && task.completed === false) {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
          return
        } else if (filter === 'all') {
          newTasks.push({ ...task, categoryName: name, categoryId: id })
        }
      })
    })

    setFilteredTasks(newTasks)
  }, [user, query, selectedDate, filter])

  const onLeftClick = () => {
    const newDate = moment(selectedDate)
      .subtract(1, 'day')
      .toDate()

    setSelectedDate(newDate)
  }

  const onRightClick = () => {
    const newDate = moment(selectedDate)
      .add(1, 'day')
      .toDate()

    setSelectedDate(newDate)
  }

  const onCalendarSelect = (value: Moment) => {
    setSelectedDate(value.toDate())
  }

  return (
    <Layout>
      <Sidebar
        selectedDate={selectedDate}
        onCalendarSelect={onCalendarSelect}
      />

      <Layout className="layout">
        <Header className="header">
          <div>
            <h1>{currentCategory}</h1>
            <p>
              <Icon className="icon left" type="left" onClick={onLeftClick} />
              {moment(selectedDate).format(dateFormat)}
              <Icon
                className="icon right"
                type="right"
                onClick={onRightClick}
              />
            </p>
          </div>

          <Select
            className="select"
            defaultValue="all"
            onSelect={value => setFilter(value)}
          >
            <Option value="all">Show all</Option>
            <Option value="incomplete">Show imcomplete</Option>
            <Option value="complete">Show complete</Option>
          </Select>
        </Header>
        <Content className="content">
          {filteredTasks.length === 0 ? (
            <Empty
              className="empty"
              description="No tasks scheduled for this date"
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
