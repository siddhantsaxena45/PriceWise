import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const navIcons = [
        { src: '/assets/icons/search.svg', alt: 'search' },
        { src: '/assets/icons/black-heart.svg', alt: 'heart' },
        { src: '/assets/icons/user.svg', alt: 'user' },
    ]
    return (
        <header className='w-full'>
            <nav className='nav'>
                <Link href="/" className='flex items-center gap-1'>
                    <Image src='/assets/icons/logo.svg' alt='logo' width={27} height={27} />
                    <p className='nav-logo'>Price<span className='text-primary'>wise </span></p>

                </Link>
                <div className='flex items-center gap-5'>
                    {navIcons.map((icon) => (
                        <Image key={icon.alt} src={icon.src} alt={icon.alt} width={27} height={27} />
                    ))}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
