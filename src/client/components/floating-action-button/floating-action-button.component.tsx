import { useState } from 'react'
import { Popover, Icon, Modal } from 'antd'

import './floating-action-button.styles.scss'
import CreateCategory from '../create-category/create-category'
import CreateTask from '../create-task/create-task'
import { NexusGenRootTypes } from '../../../generated'

interface FloatingActionButtonProps {
  categories: NexusGenRootTypes['Category'][]
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  categories
}) => {
  const [hovered, setHovered] = useState(false)
  const [createCategoryVisible, setCreateCategoryVisible] = useState(false)
  const [createTaskVisible, setCreateTaskVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  const onCategoryClick = () => {
    console.log('create category')
    setCreateCategoryVisible(true)
  }

  const onTaskClick = () => {
    categories.length === 0 ? setErrorVisible(true) : setCreateTaskVisible(true)
  }

  const hoverContent = (
    <div>
      <div className="option" onClick={onCategoryClick}>
        Create new category
      </div>
      <div className="option" onClick={onTaskClick}>
        Create new task
      </div>
    </div>
  )

  return (
    <div className="floating-action-button">
      <Popover
        content={hoverContent}
        trigger="hover"
        visible={hovered}
        onVisibleChange={() => setHovered(!hovered)}
      >
        <Icon
          className="icon"
          type="plus-circle"
          theme="twoTone"
          twoToneColor="#52c41a"
          onClick={() => setHovered(!hovered)}
        />

        <CreateCategory
          visible={createCategoryVisible}
          close={() => setCreateCategoryVisible(false)}
        />
        <CreateTask
          categories={categories}
          visible={createTaskVisible}
          close={() => setCreateTaskVisible(false)}
        />

        <Modal
          visible={errorVisible}
          footer={null}
          onCancel={() => setErrorVisible(false)}
        >
          Please first create a category!
        </Modal>
      </Popover>
    </div>
  )
}

export default FloatingActionButton
