import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/Product/ProductCard';
import Button from '../components/UI/Button';
import Loader from '../components/UI/Loader';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  const [showAll, setShowAll] = useState(false);

  const categories = [
    { id: 'new', name: 'Новый' },
    { id: 'hoodies', name: 'Худи' },
    { id: 'zip-hoodies', name: 'Зип-Худи' },
    { id: 'pants', name: 'Штаны' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeTab === 'new' 
    ? products 
    : products.filter(product => product.category === activeTab);

  const displayedProducts = showAll 
    ? filteredProducts 
    : filteredProducts.slice(0, 4);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex flex-wrap gap-3 mb-8 ">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeTab === category.id ? '' : ''}
            onClick={() => {
              setActiveTab(category.id);
              setShowAll(category.id === 'new');
            }}
          >
            {category.name}
          </Button>
        ))}
      </div>
        
      {activeTab === 'new' && (
        <section className="mt-10">
          <div className="flex > items-center mb-6">
            <h2 className="text-2xl font-bold">New Arrivals ➔</h2>
            
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === 'pants')
              .slice(0, 4)
              .map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    
      
      
    </div>
  );
};

export default ProductsPage;