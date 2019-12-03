import { Modal } from 'antd'
import { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { NexusGenRootTypes } from '../../../generated'
import { userCache } from '../../pages/dashboard'

const createCategoryMutation = gql`
  mutation CreateCategory($name: String!) {
    createCategory(data: { name: $name }) {
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
`

interface CreateCategoryProps {
  visible: boolean
  close: () => void
  updateUser: (user: any) => void
}

const CreateCategory: React.FC<CreateCategoryProps> = ({
  visible,
  close,
  updateUser
}) => {
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState(null)

  const [createCategory, { loading }] = useMutation(createCategoryMutation, {
    update: async (proxy, { data }) => {
      const { user } = await proxy.readQuery<{
        user: NexusGenRootTypes['User']
      }>({ query: userCache })

      user.categories.push(data.createCategory)

      updateUser(user)
    }
  })

  const onOk = async () => {
    let valid = true

    if (categoryName.trim() === '') {
      setError('Category name is required')
      valid = false
    } else {
      setError(null)
    }

    if (valid) {
      await createCategory({ variables: { name: categoryName } })
      close()
    }
  }

  return (
    <Modal
      title="Create new category"
      visible={visible}
      onOk={onOk}
      confirmLoading={loading}
      onCancel={close}
      okText="Submit"
    >
      <div className="input-container">
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />
        <div className="error">{error}</div>
      </div>
    </Modal>
  )
}

export default CreateCategory
