"use client"
import { scrapeAndStoreProduct } from '@/lib/actions'
import { scrapeAmazonProduct } from '@/lib/scraper'
import { set } from 'mongoose'
import React, { FormEvent, useState } from 'react'
 const isValidAmazonProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url)
      const hostname = parsedURL.hostname
      if (hostname.includes('amazon') ||
        hostname.includes('amazon.in') ||
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.")
      ) {
        return true
      }
    

    }
    catch (error) {
     return false 
    }
    return false
  }
const Searchbar = () => {
  const [searchPromt, setSearchPromt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const isValidLink=isValidAmazonProductURL(searchPromt)
      if(!isValidLink){
        alert('Please enter a valid Amazon product link')
        return
      }
      try{
        setIsLoading(true)
        const product=await scrapeAndStoreProduct(searchPromt);
      }
      catch(error:any){
        console.log(error)
      }
      finally{
        setIsLoading(false)
      }
  }
 
  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
      <input onChange={(e) => setSearchPromt(e.target.value)} value={searchPromt}  type="text" placeholder='Enter amazon product link' className='searchbar-input' />
      <button disabled={searchPromt===''} type='submit' className='searchbar-btn '>{isLoading?'Searching...':'Search'}</button>
    </form>
  )
}

export default Searchbar
