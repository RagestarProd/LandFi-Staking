'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function IntroScreen() {
    const [animate, setAnimate] = useState(false)
    const [fade, setFade] = useState(false)
    const [hideAll, setHideAll] = useState(false)
    const [show, setShow] = useState(true)

    useEffect(() => {
        // Start move+scale animation
        const animateTimer = setTimeout(() => setAnimate(true), 1500)
		
        // Start fade bg animation
        const fadeTimer = setTimeout(() => setFade(true), 2000)

        // Start hide all animation
        const hideTimer = setTimeout(() => setHideAll(true), 2500)

        // Remove from DOM after fade out completes
        const removeTimer = setTimeout(() => setShow(false), 3000)

        return () => {
            clearTimeout(animateTimer)
            clearTimeout(fadeTimer)
            clearTimeout(hideTimer)
            clearTimeout(removeTimer)
        }
    }, [])

    if (!show) return null

    return (
        <div className={`fixed inset-0 z-50  transition-all duration-500 ${hideAll ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`${fade ? 'bg-transparent' : 'bg-black'} fixed inset-0 z-50  transition-all duration-500`}>
            <div
                className={`transition-all duration-600 ease-in-out 
                    absolute 
                    ${animate ? 'top-[-60px] right-[-80px] md:top-[-70px] md:left-[-85px] md:right-[unset] scale-40 md:scale-60' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100'}
                `}
            >
                <Image
                    src="/intro.gif"
                    alt="Intro animation"
                    width={359}
                    height={205}
                    priority
                    unoptimized
                />
            </div>
            </div>
        </div>
    )
}
