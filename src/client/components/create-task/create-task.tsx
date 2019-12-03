import { Modal, DatePicker, Select, Input } from 'antd'
import { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { NexusGenRootTypes } from '../../../generated'
import { userCache } from '../../pages/dashboard'
import moment from 'moment'

const { Option } = Select
const { TextArea } = Input

const createTaskMutation = gql`
  mutation CreateTask(
    $categoryId: ID!
    $description: String!
    $date: DateTime!
  ) {
    createTask(
      data: { description: $description, categoryId: $categoryId, date: $date }
    ) {
      description
      completed
      rank
    }
  }
`

interface CreateTaskProps {
  visible: boolean
  close: () => void
  updateUser: (user: NexusGenRootTypes['User']) => void
  categories: NexusGenRootTypes['Category'][]
}

const CreateTask: React.FC<CreateTaskProps> = ({
  visible,
  close,
  updateUser,
  categories
}) => {
  const [descriptionValue, setDescriptionValue] = useState('')
  const [descriptionError, setDescriptionError] = useState(null)

  const [date, setDate] = useState(new Date())
  const [categoryId, setCategoryId] = useState(categories[0].id)

  const [createTask, { loading }] = useMutation(createTaskMutation, {
    update: async (proxy, { data }) => {
      const { user } = await proxy.readQuery<{
        user: NexusGenRootTypes['User']
      }>({ query: userCache })

      user.categories.forEach(({ id }, index) => {
        if (id === categoryId) {
          user.categories[index].tasks.push(data.createTask)
        }
      })

      updateUser(user)
    }
  })

  const onSelectChange = (value: string) => {
    setCategoryId(value)
  }

  const onOk = async () => {
    let valid = true

    if (descriptionValue.trim() === '') {
      setDescriptionError('Description is required')
      valid = false
    } else {
      setDescriptionError(null)
    }

    if (valid) {
      await createTask({
        variables: { categoryId, date, description: descriptionValue }
      })
      close()
    }
  }

  return (
    <Modal
      title="Create new task"
      visible={visible}
      onOk={onOk}
      confirmLoading={loading}
      onCancel={close}
      okText="Submit"
    >
      <div className="input-container">
        <DatePicker
          name="date"
          size="large"
          value={moment(date)}
          onChange={(moment, date) => setDate(new Date(date))}
          //   defaultValue={moment(date)}
          format={'MM-DD-YYYY'}
        />
      </div>
      <div className="input-container">
        <Select
          defaultValue={categoryId}
          style={{ width: '100%' }}
          size="large"
          onChange={onSelectChange}
        >
          {categories.map(({ id, name }) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>
      </div>

      <TextArea
        placeholder="Description"
        value={descriptionValue}
        onChange={e => setDescriptionValue(e.target.value)}
        rows={2}
      />
      <div className="error">{descriptionError}</div>
    </Modal>
  )
}

export default CreateTask
