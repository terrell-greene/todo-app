import Link from 'next/link'

import { NexusGenRootTypes } from '../../../generated'

import './category-links.styles.scss'

interface CatergoryLinksProps {
  categories: NexusGenRootTypes['Category'][]
}

const CategoryLinks: React.FC<CatergoryLinksProps> = ({ categories }) => {
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
