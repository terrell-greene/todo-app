import { Modal, DatePicker, Select, Input } from 'antd'
import { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { NexusGenRootTypes } from '../../../generated'
import { userCache } from '../../pages/dashboard'
import moment from 'moment'
import { useRouter } from 'next/router'
import { format } from 'url'

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
      id
      date
      description
      completed
      rank
    }
  }
`

interface CreateTaskProps {
  visible: boolean
  close: () => void
  categories: NexusGenRootTypes['Category'][]
}

const CreateTask: React.FC<CreateTaskProps> = ({
  visible,
  close,
  categories
}) => {
  const router = useRouter()
  const [descriptionValue, setDescriptionValue] = useState('')
  const [descriptionError, setDescriptionError] = useState(null)

  const [date, setDate] = useState(moment(new Date()))
  const [categoryId, setCategoryId] = useState(null)
  const [categoryIdError, setCategoryIdError] = useState(null)

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

      proxy.writeQuery({ query: userCache, data: { user } })
    },
    onCompleted: () => {
      const { pathname, query } = router
      const url = format({ pathname, query })

      close()

      setDate(moment(new Date()))
      setCategoryId(categories[0].id)
      setDescriptionValue('')

      router.push(url)
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

    if (!categoryId) {
      setCategoryIdError('Category is required')
      valid = false
    } else {
      setCategoryIdError(null)
    }

    if (valid) {
      await createTask({
        variables: {
          categoryId,
          date: moment(date).toDate(),
          description: descriptionValue
        }
      })
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
      centered
    >
      <div className="input-container">
        <DatePicker
          name="date"
          size="large"
          value={date}
          onChange={(moment, date) => setDate(moment)}
          format={'MM-DD-YYYY'}
        />
      </div>
      <div className="input-container">
        <Select
          style={{ width: '100%' }}
          size="large"
          onChange={onSelectChange}
          placeholder="Select a category"
        >
          {categories.map(({ id, name }) => (
            <Option key={id} value={id}>
              {name}
            </Option>
          ))}
        </Select>
        <div className="error">{categoryIdError}</div>
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
