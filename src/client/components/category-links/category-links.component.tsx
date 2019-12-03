import Link from 'next/link'

import { NexusGenRootTypes } from '../../../generated'

import './category-links.styles.scss'
import { useApolloClient } from '@apollo/react-hooks'
import { useState, useEffect } from 'react'
import { userCache } from '../../pages/dashboard'

interface CatergoryLinksProps {
  categories: NexusGenRootTypes['Category'][]
}

const CategoryLinks: React.FC<CatergoryLinksProps> = ({ categories }) => {
  // const client = useApolloClient()
  // const [categories, setCategories] = useState(props.categories)

  // useEffect(() => {
  //   const subscription = client
  //     .watchQuery({ query: userCache })
  //     .subscribe(({ data }) => {
  //       // console.log(data.user.categories)

  //       setCategories(data.user.categories)
  //     })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [])

  return (
    <ul>
      <Link href={`/dashboard`}>
        <a className="category-link">My Day</a>
      </Link>
      {categories.map(category => {
        return (
          <Link key={category.id} href={`/dashboard?categoryId=${category.id}`}>
            <a className="category-link">{category.name}</a>
          </Link>
        )
      })}
    </ul>
  )
}

export default CategoryLinks
