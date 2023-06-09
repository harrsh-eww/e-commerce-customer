import NoProduct from '@/components/Home/NoProduct';
import Product from '@/components/Home/Product';
import { useAppSelector } from '@/hooks/redux';
import axiosInstance from '@/libs/interceptor';
import toast from '@/libs/toast';
import { setProducts } from '@/redux/slice/products.slice';
import { Box } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { productListResponse } from './api/product/list';

const Home = ({ data }: { data: productListApiResponse }) => {
    const { data: session } = useSession();
    const products = useAppSelector((state) => state.products.products);
    const dispatch = useDispatch();

    const { message, products: resProducts, success } = data;

    useEffect(() => {
        const data = [];

        for (let product of resProducts) {
            const productData = {
                ...product,
            };

            const isFavorite =
                session && productData.favoriteBy
                    ? productData.favoriteBy.some(
                          (el) => el.id === +session.user.id
                      )
                    : false;

            delete productData.favoriteBy;
            data.push({
                ...productData,
                isFavorite,
            });
        }

        dispatch(
            setProducts({
                products: data,
            })
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resProducts]);

    if (!success) {
        toast(message);
        return <NoProduct />;
    }

    if (!products.length) {
        return <NoProduct />;
    }

    return (
        <Fragment>
            <Head>
                <title>Home</title>
            </Head>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 'calc(100vw - 48px)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '1rem',
                    marginX: 'auto',
                }}
            >
                {products.map((product) => {
                    return <Product key={product.id} product={product} />;
                })}
            </Box>
        </Fragment>
    );
};

export default Home;

type productListApiResponse = {
    success: boolean;
    message: string;
    products: productListResponse[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const res: productListApiResponse = await axiosInstance.get(
            'http://localhost:3000/api/product/list'
        );

        console.log(res);

        return {
            props: {
                data: res,
            },
        };
    } catch (error: any) {
        return {
            props: {
                data: {
                    ...error,
                    products: [],
                },
            },
        };
    }
};
