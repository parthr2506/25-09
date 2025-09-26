const ProductCard = ({ p, onAdd }) => {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            margin: '10px',
            padding: '16px',
            width: '200px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{p.name}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>Rs: {p.price}</p>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>{p.description}</p>

            <button
                onClick={() => onAdd(p.id)}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer'
                }}
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;
