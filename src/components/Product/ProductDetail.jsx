import { useState } from 'react';
import Button from '../UI/Button';
import ProductSwiper from './ProductSwiper';

const ProductDetail = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');

  return (
    <div className="w-full md:w-1/2">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-2xl font-semibold mb-4">{product.price} cow</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Sizes:</h3>
        <div className="flex space-x-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              className={`px-4 py-2 border rounded-md ${
                selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'border-gray-300'
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <details className="border-b border-gray-200 pb-4">
          <summary className="font-medium cursor-pointer">
            Detailed measurements
          </summary>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Length</p>
              <p>{product.measurements.length} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Width</p>
              <p>{product.measurements.width} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thickness</p>
              <p>{product.measurements.thickness} cm</p>
            </div>
          </div>
        </details>
      </div>
      
      <div className="flex space-x-4">
        <Button onClick={() => onAddToCart(selectedSize)}>Add to Cart</Button>
        <Button variant="primary">Buy Now</Button>
      </div>
      
      <div className="mt-8">
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;