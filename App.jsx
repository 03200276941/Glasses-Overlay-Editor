import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [glassesPosition, setGlassesPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [glassesSize, setGlassesSize] = useState(40);
  const [glassesRotation, setGlassesRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const handleKeyDown = (e) => {
    if (!imageUrl) return;
    
    const moveAmount = e.shiftKey ? 1 : 5; // Fine adjustment with shift key
    
    switch (e.key) {
      case 'ArrowUp':
        setGlassesPosition(prev => ({ ...prev, y: Math.max(0, prev.y - moveAmount) }));
        break;
      case 'ArrowDown':
        setGlassesPosition(prev => ({ ...prev, y: Math.min(100, prev.y + moveAmount) }));
        break;
      case 'ArrowLeft':
        setGlassesPosition(prev => ({ ...prev, x: Math.max(0, prev.x - moveAmount) }));
        break;
      case 'ArrowRight':
        setGlassesPosition(prev => ({ ...prev, x: Math.min(100, prev.x + moveAmount) }));
        break;
      case '+':
        setGlassesSize(prev => Math.min(100, prev + 5));
        break;
      case '-':
        setGlassesSize(prev => Math.max(10, prev - 5));
        break;
      case 'r':
        setGlassesRotation(prev => (prev + 15) % 360);
        break;
      case 'R':
        setGlassesRotation(prev => (prev - 15) % 360);
        break;
      default:
        break;
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageUrl) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;
    
    setGlassesPosition({ x, y });
  };

  const handleWheel = (e) => {
    if (!imageUrl) return;
    e.preventDefault();
    setGlassesSize(prev => Math.max(10, Math.min(100, prev + (e.deltaY > 0 ? -2 : 2))));
  };

  const loadImage = async () => {
    if (!imageUrl.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Test if the image loads successfully
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
      
      // Reset glasses position for new image
      setGlassesPosition({ x: 50, y: 50 });
    } catch (err) {
      setError('Failed to load image. Please check the URL and try again.');
      setImageUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUrlSubmit = (e) => {
    e.preventDefault();
    loadImage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageUrl]);

  const getGlassesStyle = () => {
    return {
      position: 'absolute',
      fontSize: `${glassesSize}px`,
      left: `${glassesPosition.x}%`,
      top: `${glassesPosition.y}%`,
      transform: `translate(-50%, -50%) rotate(${glassesRotation}deg)`,
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none',
      transition: isDragging ? 'none' : 'transform 0.2s ease',
      filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
      zIndex: 2
    };
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>👓 Glasses Overlay Editor</h1>
        <p className="app-subtitle">Position virtual glasses on any image</p>
      </header>
      
      <div className="app-content">
        <form onSubmit={handleImageUrlSubmit} className="image-url-form">
          <div className="input-group">
            <input
              type="url"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="image-input"
              required
            />
            <button 
              type="submit" 
              className="load-button"
              disabled={isLoading || !imageUrl.trim()}
            >
              {isLoading ? 'Loading...' : 'Load Image'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
        
        <div className="controls-panel">
          <div className="control-group">
            <label>Size:</label>
            <input
              type="range"
              min="10"
              max="100"
              value={glassesSize}
              onChange={(e) => setGlassesSize(parseInt(e.target.value))}
            />
            <span>{glassesSize}px</span>
          </div>
          
          <div className="control-group">
            <label>Rotation:</label>
            <input
              type="range"
              min="0"
              max="359"
              value={glassesRotation}
              onChange={(e) => setGlassesRotation(parseInt(e.target.value))}
            />
            <span>{glassesRotation}°</span>
          </div>
          
          <div className="shortcuts-info">
            <p>Shortcuts:</p>
            <ul>
              <li>Arrow keys: Move glasses</li>
              <li>+/-: Resize glasses</li>
              <li>R/r: Rotate glasses</li>
              <li>Shift + Arrows: Fine movement</li>
              <li>Mouse wheel: Resize</li>
            </ul>
          </div>
        </div>
        
        {imageUrl && !error && (
          <div 
            className="image-editor-container"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div className="image-wrapper">
              <img 
                src={imageUrl} 
                alt="User provided" 
                className="user-image" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/800x500?text=Invalid+Image+URL';
                  setError('Failed to load image. Showing placeholder instead.');
                }}
              />
              <div 
                className="glasses" 
                style={getGlassesStyle()}
                onMouseDown={handleMouseDown}
              >
                👓
              </div>
            </div>
            
            <div className="position-indicator">
              Position: X: {glassesPosition.x.toFixed(1)}%, Y: {glassesPosition.y.toFixed(1)}%
            </div>
          </div>
        )}
      </div>
      
      <footer className="app-footer">
        <p>Drag to position glasses • Scroll to resize • Use controls for precise adjustments</p>
      </footer>
    </div>
  );
}

export default App;