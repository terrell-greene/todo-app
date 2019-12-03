import { Icon, Button } from 'antd'
import gql from 'graphql-tag'

import './task-list.styles.scss'
import { IClientTask } from '../../utils'
import { useMutation } from '@apollo/react-hooks'
import { NexusGenRootTypes } from '../../../generated'
import { userCache } from '../../pages/dashboard'

interface TaskListProps {
  tasks: IClientTask[]
  updateUser: (user: NexusGenRootTypes['User']) => void
}

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

const TaskList: React.FC<TaskListProps> = ({ tasks, updateUser }) => {
  const [updateTasks] = useMutation(updateTasksMutation, {
    update: async (proxy, { data }) => {
      const { user } = await proxy.readQuery<{
        user: NexusGenRootTypes['User']
      }>({ query: userCache })

      user.categories.forEach(({ id, tasks }, index) => {
        tasks.forEach(({ id }, taskIndex) => {
          if (id === data.updateTasks[0].id) {
            user.categories[index].tasks[taskIndex] = data.updateTasks[0]
          }
        })
      })

      updateUser(user)
    }
  })

  const onClick = (id: string, completed: boolean) => {
    const task = { id, completed: !completed }

    updateTasks({ variables: { tasks: [task] } })
  }

  return (
    <ul>
      {tasks.map(task => {
        const { id, completed } = task

        return (
          <li key={id} className="task-list-item">
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
              <span className="category-name">{task.categoryName}</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default TaskList
