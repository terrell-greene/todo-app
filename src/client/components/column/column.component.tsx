import { NextPage } from 'next'

import { NexusGenRootTypes } from '../../../generated'
import Task from '../task/task.component'

import './column.styles.scss'
import { Droppable } from 'react-beautiful-dnd'

interface ColumnProps {
  tasks: NexusGenRootTypes['Task'][]
}

const Column: NextPage<ColumnProps> = ({ tasks }) => {
  return (
    <div className="column-container">
      <h3 className="title">Title</h3>
      <Droppable droppableId={'todo'}>
        {provided => {
          return (
            <div
              className="task-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} index={index} task={task} />
              ))}
              {provided.placeholder}
            </div>
          )
        }}
      </Droppable>
    </div>
  )
}

export default Column
