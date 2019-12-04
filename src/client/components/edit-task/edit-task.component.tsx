import { Modal, DatePicker, Select, Input, Button } from 'antd'
import { useState } from 'react'
import moment from 'moment'

import { NexusGenRootTypes } from '../../../generated'

interface EditTaskProps {
  task: NexusGenRootTypes['Task']
  visible: boolean
  close: () => void
}

const { TextArea } = Input

const EditTask: React.FC<EditTaskProps> = ({ visible, close, task }) => {
  const [descriptionValue, setDescriptionValue] = useState(task.description)
  const [descriptionError, setDescriptionError] = useState(null)

  const [date, setDate] = useState(new Date(task.date))
  return (
    <Modal title="Edit task" centered visible={visible} onCancel={close}>
      <div className="input-container">
        <DatePicker
          name="date"
          size="large"
          value={moment(date)}
          onChange={(moment, date) => setDate(new Date(date))}
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
      <Button style={{ marginTop: '2rem' }} type="danger" block>
        Delete Task
      </Button>
    </Modal>
  )
}

export default EditTask
