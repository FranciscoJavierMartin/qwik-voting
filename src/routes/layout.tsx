import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import Header from '~/components/header';
import styles from './styles.css?inline';

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
    </>
  );
});
