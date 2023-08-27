import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';
import prismaClient from '~/lib/prismaClient';
import Header from '~/components/header';
import styles from './styles.css?inline';

export const useCategories = routeLoader$(async () => {
  const categories = await prismaClient.category.findMany();
  return categories;
});

export default component$(() => {
  const categories = useCategories();
  const location = useLocation();

  console.log(location.url.pathname);

  useStyles$(styles);
  return (
    <>
      <Header />
      <main class='p-2'>
        <div class='md:grid md:grid-cols-[20%_80%] gap-3'>
          <div class='flex flex-col'>
            <Link
              href='/'
              class={{
                'bg-gray-300 text-black rounded-md font-bold':
                  location.url.pathname === '/',
                'p-2': true,
              }}
            >
              <div>Home</div>
            </Link>
            {categories.value?.map((category) => (
              <Link
                href={`/categories/${category.id}`}
                key={category.id}
                class={{
                  'bg-gray-300 text-black rounded-md font-bold':
                    location.url.pathname === `/categories/${category.id}/`,
                  'p-2': true,
                }}
              >
                <div>{category.name}</div>
              </Link>
            ))}
          </div>
          <div>
            <Slot />
          </div>
        </div>
      </main>
    </>
  );
});
