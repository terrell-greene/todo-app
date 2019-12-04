import { NextPage } from 'next'
import { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Icon, Button } from 'antd'
import moment from 'moment'
import gql from 'graphql-tag'

import { IClientTask } from '../../utils'
import EditTask from '../edit-task/edit-task.component'

import './task.styles.scss'

interface TaskProps {
  task: IClientTask
}

const updateTasksMutation = gql`
  mutation UpdateTasks($tasks: [UpdateTaskInput!]!) {
    updateTasks(data: { tasks: $tasks }) {
      id
      rank
      completed
      description
      date
    }
  }
`

const Task: NextPage<TaskProps> = ({ task }) => {
  const { id, completed } = task
  const [updateTasks] = useMutation(updateTasksMutation)
  const [editTaskVisible, setEditTaskVisible] = useState(false)

  const updateComplete = () => {
    const task = { id, completed: !completed }

    updateTasks({ variables: { tasks: [task] } })
  }

  return (
    <div className="task-list-item">
      {completed ? (
        <Icon
          className="icon completed"
          type="check-circle"
          theme="twoTone"
          twoToneColor="#52c41a"
          onClick={updateComplete}
        />
      ) : (
        <Button
          className="icon"
          size="default"
          shape="circle"
          onClick={updateComplete}
        />
      )}

      <div>
        <span className={`description ${completed ? 'completed' : ''}`}>
          {task.description}
        </span>
        <span className="category-name">
          {task.categoryName} -{' '}
          {moment(new Date(task.date)).format('MM/DD/YYYY')}
        </span>
      </div>

      <div style={{ marginLeft: 'auto' }}>
        <Icon
          onClick={() => setEditTaskVisible(true)}
          className="icon small"
          type="edit"
          theme="twoTone"
        />
      </div>

      <EditTask
        task={task}
        visible={editTaskVisible}
        close={() => setEditTaskVisible(false)}
      />
    </div>
  )
}

export default Task
