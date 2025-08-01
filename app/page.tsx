import HeroCarousel from '@/components/HeroCarousel'
import ProductCard from '@/components/ProductCard'
import Searchbar from '@/components/Searchbar'
import { getAllProducts } from '@/lib/actions'
import { all } from 'axios'
import { get } from 'http'
import Image from 'next/image'
import React from 'react'

const Home = async () => {
  const allProducts=await getAllProducts()
  return (
    <>
      <section className='px-6 md:px-20 py-20 '>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className=' text-primary flex gap-2'>
              <span className='text-small'>   Smart Shopping Starts here</span>
              <Image src="/assets/icons/arrow-right.svg" alt="arrow" width={16} height={16} />
            </p>
            <h1 className='head-text'>
              Unleash the Power of <span className='text-primary'>PriceWise</span>
            </h1>
            <p className='mt-6'>
              Powerful , self-serve product price comparison tool that helps you find the best deals on your favorite products.
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>
      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16'>{allProducts?.map((product) => (
          <ProductCard key={product._id} product={product}/>
        ))}</div>

      </section>
    </>
  )
}

export default Home
