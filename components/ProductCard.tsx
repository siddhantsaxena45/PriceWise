import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AiFillStar } from 'react-icons/ai'
type Props = {
    product: Product
}
const ProductCard = ({ product }: Props) => {
    return (
        <Link href={`/products/${product._id}`} className='product-card'>
            <div className='product-card_img-container'>
                <Image src={product.image} alt={product.title} width={200} height={200} className='product-card_img' />

            </div>
            <div className='flex flex-col gap-3'>
                <h2 className='product-title'>{product.title} </h2>
                <p className='text-black opacity-50 text-sm truncate'>{product.category}</p>
                <div className='flex justify-between'>
                    <p className=' text-sm text-black flex items-center'><span>{product.stars}</span> <span><AiFillStar className='text-yellow-500'/></span> </p>
                    <p className='font-semibold text-black text-sm '><span>{product.currency}</span><span>{product.currentPrice}</span></p>

                </div>

            </div>
        </Link>
    )
}

export default ProductCard
