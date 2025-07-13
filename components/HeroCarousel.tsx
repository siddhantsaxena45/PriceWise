"use client"
import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';

const heroImage = [
    { imageUrl: "assets/images/hero-1.svg", alt: "smartwatch" },
    { imageUrl: "assets/images/hero-2.svg", alt: "bag" },
    { imageUrl: "assets/images/hero-3.svg", alt: "lamp" },
    { imageUrl: "assets/images/hero-4.svg", alt: "air fryer" },
    { imageUrl: "assets/images/hero-5.svg", alt: "chair" },
]
const HeroCarousel = () => {
    return (
        <div className='hero-carousel'>
            <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop interval={2000} showArrows={false}>
                {heroImage.map((image) => (

                    <Image key={image.alt} src={image.imageUrl} alt={image.alt} width={484} height={484} className='object-contain' />

                ))}
            </Carousel>
            <Image src="/assets/icons/hand-drawn-arrow.svg" alt="arrow" width={175} height={175} className='absolute bottom-0 max-xl:hidden z-0 -left-[15%]' />
        </div>
    )
}

export default HeroCarousel
