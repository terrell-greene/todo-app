import { Icon, Button } from 'antd'
import gql from 'graphql-tag'

import './task-list.styles.scss'
import { IClientTask } from '../../utils'
import { useMutation } from '@apollo/react-hooks'
import { NexusGenRootTypes } from '../../../generated'
import { userCache } from '../../pages/dashboard'
import moment from 'moment'

interface TaskListProps {
  tasks: IClientTask[]
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

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [updateTasks] = useMutation(updateTasksMutation)

  const onClick = (id: string, completed: boolean) => {
    const task = { id, completed: !completed }

    updateTasks({ variables: { tasks: [task] } })
  }

  return (
    <div>
      {tasks.map(task => {
        const { id, completed } = task

        return (
          <div key={id} className="task-list-item">
            {completed ? (
              <Icon
                className="icon completed"
                type="check-circle"
                theme="twoTone"
                twoToneColor="#52c41a"
                onClick={() => onClick(id, completed)}
              />
            ) : (
              <Button
                className="icon"
                size="default"
                shape="circle"
                onClick={() => onClick(id, completed)}
              />
            )}

            <div>
              <span className={`description ${completed ? 'completed' : ''}`}>
                {task.description}
              </span>
              <span className="category-name">
                {task.categoryName} - {moment(task.date).format('MM/DD/YYYY')}
              </span>
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <Icon className="icon small" type="edit" theme="twoTone" />
              <Icon
                className="icon small "
                type="delete"
                theme="twoTone"
                twoToneColor="#eb2f96"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TaskList
