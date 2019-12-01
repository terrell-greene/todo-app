import { NextPage } from 'next'
import { Draggable } from 'react-beautiful-dnd'

import { NexusGenRootTypes } from '../../../generated'

import './task.styles.scss'

interface TaskProps {
  index: number
  task: NexusGenRootTypes['Task']
}

const Task: NextPage<TaskProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {provider => {
        return (
          <div
            className="task-container"
            {...provider.draggableProps}
            {...provider.dragHandleProps}
            ref={provider.innerRef}
          >
            {task.description}
          </div>
        )
      }}
    </Draggable>
  )
}

export default Task
