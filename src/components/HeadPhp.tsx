import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface HeadProps {
  title: string;
  description?: string;
  bodyClass?: string;
  additionalHead?: string;
}

export default function Head({ title, description, bodyClass = 'bg-gray-50', additionalHead }: HeadProps) {
  // Add body class
  useEffect(() => {
    if (bodyClass) {
      document.body.className = bodyClass;
    }

    return () => {
      document.body.className = '';
    };
  }, [bodyClass]);

  return (
    <Helmet>
      <title>{title} - DataFirst SEO</title>
      {description && <meta name="description" content={description} />}

      {/* PHP site required CSS */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Allow additional head content */}
      {additionalHead && <div dangerouslySetInnerHTML={{ __html: additionalHead }} />}
    </Helmet>
  );
}
