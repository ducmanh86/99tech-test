export const isDev = () => {
  return (process.env.NODE_ENV?.toLowerCase() ?? 'development') === 'development';
};
