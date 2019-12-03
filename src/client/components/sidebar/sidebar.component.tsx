import { Layout, Calendar } from 'antd'

import CategoryLinks from '../category-links/category-links.component'
import { NexusGenRootTypes } from '../../../generated'

import './sidebar.styles.scss'
import { useApolloClient } from '@apollo/react-hooks'
import { useState, useEffect } from 'react'
import { props } from 'bluebird'
import { userCache } from '../../pages/dashboard'

const { Sider } = Layout

interface SidebarProps {
  categories: NexusGenRootTypes['Category'][]
}

const Sidebar: React.FC<SidebarProps> = props => {
  const client = useApolloClient()
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState(props.categories)
  const test = (user: any) => {
    if (props.categories.length !== user.categories.length) {
      setCategories(user.categories)
      console.log(categories)
    }
  }

  useEffect(() => {
    const subscription = client
      .watchQuery({ query: userCache })
      .subscribe(({ data }) => {
        // console.log(data.user.categories)

        test(data.user)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
