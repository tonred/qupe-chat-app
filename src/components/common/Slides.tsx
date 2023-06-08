import { Carousel } from 'antd'
import { type CarouselProps, type CarouselRef } from 'antd/lib/carousel'
import React, { useImperativeHandle, useRef } from 'react'

import './Slides.less'

export interface SlidesRef {
    next: () => void
    prev: () => void
}

export const Slides = React.forwardRef<SlidesRef, CarouselProps>((props, ref) => {
    const carouselRef = useRef<CarouselRef>(null)

    useImperativeHandle(
        ref,
        () => ({
            next() {
                carouselRef.current?.next()
            },
            prev() {
                carouselRef.current?.prev()
            },
        }),
        [],
    )

    return (
        <Carousel
            className="slides"
            ref={carouselRef}
            {...props}
            dots={false}
            swipe={false}
            adaptiveHeight
            infinite={false}
        >
            {props.children}
        </Carousel>
    )
})
Slides.displayName = 'Slides'
