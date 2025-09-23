'use client'

import Image from 'next/image'

import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

export default function Carousel() {
  return (
    <div className="w-full max-w-lg">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        className="rounded-lg shadow-xl bg-white"
      >
        <SwiperSlide>
          <Image
            src="/images/dash.png"
            alt="Dashboard da plataforma Fintri"
            width={500}
            height={400}
            className="rounded-lg w-full h-[400px] object-contain"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/quote-2.png"
            alt="Criação de orçamentos na plataforma Fintri"
            width={500}
            height={400}
            className="rounded-lg w-full h-[400px] object-contain"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}
