import { useState, useEffect } from "react";
import { useAuth } from "../useAuth";
import api from "../api";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Watchlist = () => {
    const { user, isLoading } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!user?.id || isLoading) {
                setWatchlist([]);
                return;
            }
            try {
                const res = await api.get(`/watchlist/${user.id}`);
                setWatchlist(res.data.watchlist);
            } catch (error) {
                console.error("Error fetching watchlist", error);
            }
        };
        fetchWatchlist();
    }, [user, isLoading]);

    const remove = async (productId) => {
        // if (!user?.id) return;

        try {
            await api.post("/watchlist/remove", {
                userId: user.id,
                productId,
            });
            setWatchlist((prev) => prev.filter((item) => item.id !== productId));
            setOpenAlert(true);
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Error removing item try again");
        }
    };

    const handleCloseAlert = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <>
            <h2>Your Watchlist</h2>
            {isLoading ? (
                <p>Loading watchlist...</p>
            ) : watchlist.length === 0 ? (
                <div>
                    <p>No items in your watchlist</p>
                    <div className='cartActions'>
                        <Button startIcon={<ArrowBackSharpIcon />} onClick={() => navigate('/home')}>BACK</Button>
                    </div>
                </div>
            ) : (
                <div className="cartWrapper">
                    {watchlist.map((product) => (
                        <div key={product.id} className="cartCard">
                            <img src={product.images} alt={product.name} />
                            <div className="itemDetails">
                                <h5>{product.name}</h5>
                                <p><strong>Rs:</strong> {product.price}</p>
                            </div>
                            <Button
                                className="remove-btn"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => remove(product.id)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>
            )}
            {watchlist.length > 0 && (
                <div className='cartActions'>
                    <Button startIcon={<ArrowBackSharpIcon />} onClick={() => navigate('/home')}>BACK</Button>
                </div>
            )}

            <Snackbar open={openAlert} autoHideDuration={800} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <MuiAlert onClose={handleCloseAlert} elevation={6} variant="filled" severity='error'>
                    Product Removed From Watchlist
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default Watchlist;
