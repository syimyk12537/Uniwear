import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Autoplay } from 'swiper/modules';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice';
import Button from '../components/UI/Button';
import ProductCard from '../components/Product/ProductCard';
import Loader from '../components/UI/Loader';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const mainSwiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const popupRef = useRef(null);

  const checkPopupClosed = useCallback(() => {
    if (!popupRef.current) return true;
    
    try {
      return popupRef.current.closed;
    } catch (e) {
      
      console.warn('Cross-Origin-Opener-Policy blocked window.closed check');
      return true;
    }
  }, []);



  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        sizes: doc.data().sizes || ['XS', 'S', 'M', 'L', 'XL'],
        measurements: doc.data().measurements || {
          XS: { length: 90, width: 40, thickness: 2 },
          S: { length: 95, width: 42, thickness: 2 },
          M: { length: 100, width: 44, thickness: 2 },
          L: { length: 105, width: 46, thickness: 2 },
          XL: { length: 110, width: 48, thickness: 2 }
        }
      }));
      setProducts(productsData);

      if (id) {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = { 
            id: docSnap.id,
            ...docSnap.data(),
            images: docSnap.data().images || ['/placeholder.jpg'],
            sizes: docSnap.data().sizes || ['XS', 'S', 'M', 'L', 'XL'],
            measurements: docSnap.data().measurements || {
              XS: { length: 90, width: 40, thickness: 2 },
              S: { length: 95, width: 42, thickness: 2 },
              M: { length: 100, width: 44, thickness: 2 },
              L: { length: 105, width: 46, thickness: 2 },
              XL: { length: 110, width: 48, thickness: 2 }
            }
          };
          setProduct(productData);

          if (productData.category) {
            const similar = productsData
              .filter(p => p.category === productData.category && p.id !== productData.id)
              .slice(0, 4);
            setSimilarProducts(similar);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const updateNavigation = () => {
      try {
        if (mainSwiperRef.current?.swiper && prevRef.current && nextRef.current) {
          const swiperInstance = mainSwiperRef.current.swiper;
          
          swiperInstance.params.navigation.prevEl = prevRef.current;
          swiperInstance.params.navigation.nextEl = nextRef.current;
          
          swiperInstance.navigation.destroy();
          swiperInstance.navigation.init();
          swiperInstance.navigation.update();
        }
      } catch (error) {
        console.error('Swiper navigation error:', error);
      }
    };

    updateNavigation();
    
    const handleResize = () => updateNavigation();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      alert('Пожалуйста, выберите размер');
      return;
    }

    if (product) {
      dispatch(addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.images[0],
        description: product.description,
        quantity: 1
      }));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleThumbnailClick = (index) => {
    mainSwiperRef.current?.swiper?.slideTo(index);
  };

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  if (loading) return <Loader />;
  if (!product) return <div className="container mx-auto px-4 py-8 text-center">Товар не найден</div>;

  const mainSliderImages = product.images.length > 1 
    ? [...product.images, product.images[0], product.images[1]] 
    : product.images;

  const thumbnailImages = product.images.length >= 8 
    ? product.images.slice(0, 8)
    : [...product.images, ...Array(8 - product.images.length).fill(product.images[0])].slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-9">
        
        <div className="w-full lg:w-1/2 relative group">
          <Swiper
            ref={mainSwiperRef}
            spaceBetween={10}
            loop={mainSliderImages.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
              disabledClass: 'opacity-30 cursor-default'
            }}
            modules={[Navigation, Thumbs, Autoplay]}
            className="h-136 w-full mb-4 rounded-lg overflow-hidden shadow-lg"
            onSlideChange={handleSlideChange}
          >
            {mainSliderImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className=" h-full w-full flex items-center justify-center bg-white">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          
          <button
            ref={prevRef}
            className="absolute  top-70 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-800">
              <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            ref={nextRef}
            className="absolute right-0 top-70 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 duration-300"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-800">
              <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {activeIndex + 1} / {product.images.length}
          </div>

          <div className="grid grid-cols-8 gap-2 mt-4">
            {thumbnailImages.map((image, index) => (
              <div
                key={index}
                ref={el => thumbnailRefs.current[index] = el}
                onClick={() => handleThumbnailClick(index)}
                className={`relative h-20 cursor-pointer rounded border-2 transition-all ${
                  activeIndex === index % product.images.length 
                    ? 'border-black scale-105' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">{product.price} сом</p>
          
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Размеры:</h3>
                {selectedSize && (
                  <span className="text-sm text-gray-500">
                    Выбран: <span className="font-semibold">{selectedSize}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black transform scale-105'
                        : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
            </div>
          )}
          
          <div className="mb-6">
            <button 
              onClick={() => setShowMeasurements(!showMeasurements)}
              className=" flex items-center "
            >
              {showMeasurements ? 'Скрыть размеры' : 'Подробнее о размерах'}
              <svg className={`ml-2 transition-transform ${showMeasurements ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            
            {showMeasurements && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Размер</th>
                      <th className="text-left pb-2">Длина</th>
                      <th className="text-left pb-2">Ширина</th>
                      <th className="text-left pb-2">Толщина</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizes.map(size => (
                      <tr key={size} className="border-b">
                        <td className="py-2">{size}</td>
                        <td className="py-2">{product.measurements[size]?.length} см</td>
                        <td className="py-2">{product.measurements[size]?.width} см</td>
                        <td className="py-2">{product.measurements[size]?.thickness} см</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="flex flex-col  gap-4 mb-8">
            <Button 
              variant="primary" 
              onClick={handleBuyNow}
              className="flex-1 py-3 hover:scale-[1.02] transition-transform"
            >
              Приобрести
            </Button>
            <Button 
              onClick={handleAddToCart}
              className="flex-1 py-3 hover:scale-[1.02] transition-transform bg-white text-black border-gray-100 hover:bg-gray-50"
            >
              Добавить в корзину
            </Button>
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Описание</h3>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
      
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Похожие товары ⮞</h2>
            
          </div>
          
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 }
            }}
            modules={[Navigation]}
            className="similar-products-swiper"
          >
            {similarProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard 
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductPage;