import { useAuth } from "../useAuth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

const ProductCard = ({ p, onAdd, isAdding, inWatchlist, onToggleWatchlist }) => {
    const { isLoading, user } = useAuth();
    const navigate = useNavigate();

    const handleToggleClick = () => {
        if (!user?.id) {
            navigate("/login");
            return;
        }
        onToggleWatchlist(p.id, inWatchlist);
    };

    return (
        <div className="productCard">
            <h3>{p.name}</h3>
            <img src={p.images[0]} alt={p.name} />
            <p>Rs: {p.price}</p>
            <p className="description-text">{p.description}</p>
            <p>Stock:{p.stock}</p>
            <div className="btnGroup">
                <button

                    onClick={() => onAdd(p.id)}
                    disabled={p.stock <= 0 || isAdding}
                >
                    {p.stock <= 0 ? "Out of Stock" : "Add To cart"}
                </button>
                <button className="heart" onClick={handleToggleClick} disabled={isLoading || !p || !p.id}>
                    {inWatchlist ? (
                        <>
                            <FontAwesomeIcon icon={faSolidHeart} style={{ color: 'red' }} />
                            {/* <span> Remove from Watchlist</span> */}
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faRegularHeart} />
                            {/* <span> Add to watchlist</span> */}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};


export default ProductCard;
