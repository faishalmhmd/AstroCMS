// lib/getPages.js
export function getPages() {
  const pages = import.meta.glob('../pages/*.astro', { eager: true });

  return Object.keys(pages)
    .map((path) => {
      const name = (path.split('/').pop() ?? '').replace('.astro', '');
      return {
        name,
        path: '/' + (name === 'index' ? '' : name),
      };
    })
    .filter(
      (page) => !['index', 'login', 'register', 'dashboard'].includes(page.name)
    );
}
