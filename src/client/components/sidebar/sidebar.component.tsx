import { Layout, Calendar } from 'antd'
import { useQuery } from '@apollo/react-hooks'

import CategoryLinks from '../category-links/category-links.component'
import { userCache } from '../../pages/dashboard'

import './sidebar.styles.scss'

const { Sider } = Layout

const Sidebar: React.FC = () => {
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
          <Calendar fullscreen={false} />
        </div>
      </div>
    </Sider>
  )
}

export default Sidebar
