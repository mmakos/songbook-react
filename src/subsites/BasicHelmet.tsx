import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

const APP_TITLE = 'Śpiewnik Michała Makosia';
const APP_HREF = import.meta.env.VITE_HREF;

interface IBasicHelmetProps {
  title?: string;
  href?: string;
  description?: string;
}

const BasicHelmet: FC<IBasicHelmetProps> = ({ title, href, description }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | ${APP_TITLE}` : APP_TITLE}</title>
      {href && <link rel="canonical" href={`${APP_HREF}/song/${href}`} />}
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};
export default BasicHelmet;
