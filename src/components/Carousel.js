"use client";
import React, { useState, useEffect } from 'react';
import styles from '../styles/Carousel.module.css';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import axios from 'axios';
import url from '@/host/host';


const Carousel = () => {
  var [images,setImages]=useState([{image:"image"}])
  const [currentIndex, setCurrentIndex] = useState(0);
  var router=useRouter()
  var { fastfood }=router.query
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(()=>{
if(fastfood){
axios.get(`${url}/carousel`).then(res=>{
setImages(res.data.filter(item=>item.fastfood_id==fastfood))
})
}

  },[fastfood])
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000); // har 2 sekundda slayd almashadi
    return () => clearInterval(interval); // komponent o‘chirilsa, interval ham to‘xtaydi
  }, [currentIndex]); // har o‘zgarishda yangilanadi

  return (<>
  {images.length>1?(<div className={styles.carousel}>
      <button className={classNames(styles.carousel__button, styles.prev)} onClick={prevSlide}>
        ‹
      </button>
      <div className={styles.carousel__item}>
        <img
          src={images[currentIndex].image}
          alt={`Ad ${currentIndex + 1}`}
          className={styles.carousel__image}
        />
      </div>
      <button className={classNames(styles.carousel__button,styles.next)} onClick={nextSlide}>
        ›
      </button>
    </div>):<></>}
     </>
  );
};

export default Carousel;
