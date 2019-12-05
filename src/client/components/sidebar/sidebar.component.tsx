import { Layout, Calendar } from 'antd'
import { useQuery } from '@apollo/react-hooks'

import CategoryLinks from '../category-links/category-links.component'
import { userCache } from '../../pages/dashboard'

import './sidebar.styles.scss'
import moment, { Moment } from 'moment'

interface SidebarProps {
  onCalendarSelect: (value: Moment) => void
  selectedDate: Date
}

const { Sider } = Layout

const Sidebar: React.FC<SidebarProps> = ({
  onCalendarSelect,
  selectedDate
}) => {
  const {
    data: {
      user: { categories }
    }
  } = useQuery(userCache)

  return (
    <Sider
      breakpoint="sm"
      trigger={null}
      collapsedWidth={0}
      defaultCollapsed={true}
      width={400}
    >
      <div className="sider">
        <CategoryLinks categories={categories} />

        <div className="calendar-container">
          <Calendar
            fullscreen={false}
            onSelect={onCalendarSelect}
            value={moment(selectedDate)}
          />
        </div>
      </div>
    </Sider>
  )
}

export default Sidebar
