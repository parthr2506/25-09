const ProductCard = ({ p, onAdd, isAdding }) => {
    return (
        <div className="productCard">
            <h3>{p.name}</h3>
            <p >Rs: {p.price}</p>
            <p>{p.description}</p>
            <p>Stock:{p.stock}</p>

            <button className="Add-btn"
                onClick={() => onAdd(p.id)}
                disabled={p.stock <= 0 || isAdding}
            >
                {p.stock <= 0 ? "Out of Stock" : "Add To cart"}
            </button>
        </div>
    );
};

export default ProductCard;
