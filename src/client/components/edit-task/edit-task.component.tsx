import { Modal, DatePicker, Input, Button } from 'antd'
import { useState } from 'react'
import moment from 'moment'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { IClientTask } from '../../utils'
import { NexusGenRootTypes } from '../../../generated'
import { userCache } from '../../pages/dashboard'
import { useRouter } from 'next/router'
import { format } from 'url'

interface EditTaskProps {
  task: IClientTask
  visible: boolean
  close: () => void
}

const { TextArea } = Input

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

const deleteTaskMutation = gql`
  mutation DeleteTask($taskId: ID!, $categoryId: ID!) {
    deleteTask(data: { taskId: $taskId, categoryId: $categoryId })
  }
`

const EditTask: React.FC<EditTaskProps> = ({ visible, close, task }) => {
  const router = useRouter()
  const [descriptionValue, setDescriptionValue] = useState(task.description)
  const [descriptionError, setDescriptionError] = useState(null)
  const [date, setDate] = useState(moment(task.date))

  const [updateTasks] = useMutation(updateTasksMutation)
  const [deleteTask] = useMutation(deleteTaskMutation, {
    update: async (proxy, { data }) => {
      const { user } = await proxy.readQuery<{
        user: NexusGenRootTypes['User']
      }>({ query: userCache })

      user.categories.forEach(({ id }, index) => {
        if (id === task.categoryId) {
          const taskIndex = user.categories[index].tasks.findIndex(
            toDelete => toDelete.id === task.id
          )

          user.categories[index].tasks.splice(taskIndex, 1)
        }
      })

      proxy.writeQuery({ query: userCache, data: { user } })
    },
    onCompleted: () => {
      const { pathname, query } = router
      const url = format({ pathname, query })

      router.push(url)
    }
  })

  const onOk = async () => {
    let valid = true

    if (descriptionValue.trim() === '') {
      setDescriptionError('Description is required')
      valid = false
    } else {
      setDescriptionError(null)
    }

    if (valid) {
      const updatedTask = { id: task.id, date, description: descriptionValue }
      await updateTasks({
        variables: { tasks: [updatedTask] }
      })
      close()
    }
  }

  const onDelete = async () => {
    await deleteTask({
      variables: { taskId: task.id, categoryId: task.categoryId }
    })

    close()
  }

  return (
    <Modal
      title="Edit task"
      centered
      visible={visible}
      onCancel={close}
      onOk={onOk}
    >
      <div className="input-container">
        <DatePicker
          name="date"
          size="large"
          value={moment(date)}
          onChange={(moment, date) => setDate(moment)}
          format={'MM-DD-YYYY'}
        />
      </div>
      <TextArea
        placeholder="Description"
        value={descriptionValue}
        onChange={e => setDescriptionValue(e.target.value)}
        rows={2}
      />
      <div className="error">{descriptionError}</div>
      <Button
        onClick={onDelete}
        style={{ marginTop: '2rem' }}
        type="danger"
        block
      >
        Delete Task
      </Button>
    </Modal>
  )
}

export default EditTask
