import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { productListResponse } from '@/pages/api/product/list';
import { toggleFavoriteProduct } from '@/redux/slice/products.slice';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWRMutation from 'swr/mutation';

const Product = (props: IProps) => {
    const { product } = props;
    const { push } = useRouter();
    const dispatch = useDispatch();

    const { trigger, isMutating } = useSWRMutation(
        '/api/product/toggleFavorite',
        fetcher,
        {
            onError(err) {
                toast(err.message);
            },
            onSuccess() {
                dispatch(
                    toggleFavoriteProduct({
                        id: product.id,
                    })
                );
            },
        }
    );

    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        const loadImage = setTimeout(() => {
            setIsImageLoading(false);
        }, 2000);

        return () => clearTimeout(loadImage);
    }, []);

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                minHeight: '266px',
                minWidth: '337px',
                userSelect: 'none',
                position: 'relative',
            }}
        >
            {isMutating ? (
                <Box
                    sx={{
                        position: 'absolute',
                        bgcolor: 'black',
                        opacity: '30%',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        left: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '999',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : null}

            <Box className="relative h-40">
                <Image
                    priority
                    fill
                    src={product.coverImage || ''}
                    alt={product.title}
                    sizes="160px"
                    style={{
                        objectFit: 'contain',
                        cursor: 'pointer',
                        display: isImageLoading ? 'none' : 'block',
                    }}
                    onClick={() => {
                        push(`product/${product.id}`);
                    }}
                />

                <Skeleton
                    variant="rounded"
                    width={'100%'}
                    height={'100%'}
                    sx={{
                        display: isImageLoading ? 'block' : 'none',
                        marginX: 'auto',
                    }}
                />
            </Box>

            <Box className="flex items-start mt-4 gap-4">
                <Box className="flex flex-col">
                    <Link href={`product/${product.id}`}>
                        <Typography className="product-title font-medium hover:underline">
                            {product.title}
                        </Typography>
                    </Link>

                    <Typography
                        variant="body2"
                        className="mt-1 mb-4 text-gray-400 font-extralight"
                    >
                        by {product.seller?.name}
                    </Typography>
                </Box>

                <Box
                    className="mt-1 text-red-600 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                        trigger({
                            id: product.id,
                        });
                    }}
                >
                    {product.isFavorite ? (
                        <FavoriteOutlinedIcon />
                    ) : (
                        <FavoriteBorderOutlinedIcon />
                    )}
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                    >
                        <Rating
                            name="product-rating"
                            value={product.ratings}
                            precision={0.5}
                            readOnly
                        />

                        <Typography
                            sx={{
                                fontSize: '0.8rem',
                            }}
                        >
                            {product.totalRatings}
                        </Typography>
                    </Box>

                    <Typography>₹{product.price}</Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <IconButton aria-label="removeFromCart">
                        <RemoveIcon />
                    </IconButton>

                    <Typography
                        sx={{
                            cursor: 'text',
                        }}
                    >
                        0
                    </Typography>

                    <IconButton aria-label="addToCart">
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
};

export default Product;

interface IProps {
    product: productListResponse;
}

const fetcher = async (
    url: string,
    {
        arg,
    }: {
        arg: {
            id: number;
        };
    }
) => {
    const response = await axiosInstance.post(url, {
        id: arg.id,
    });
    return response.data;
};
