import { useAuth } from "./useAuth";

const ProductCard = ({ p, onAdd, isAdding }) => {
    const { login } = useAuth()
    return (
        <div className="productCard">
            <h3>{p.name}</h3>
            <img src={p.images[0]} alt={p.name} />
            <p >Rs: {p.price}</p>
            <p className="description-text">{p.description}</p>
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
