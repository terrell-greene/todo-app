import { Layout, Calendar } from 'antd'

import CategoryLinks from '../category-links/category-links.component'
import { NexusGenRootTypes } from '../../../generated'

import './sidebar.styles.scss'

const { Sider } = Layout

interface SidebarProps {
  categories: NexusGenRootTypes['Category'][]
}

const Sidebar: React.FC<SidebarProps> = ({ categories }) => {
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
