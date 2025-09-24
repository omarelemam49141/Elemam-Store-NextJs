export const revalidate = 86400; // 24 hours in seconds

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="border-t-1">
        <div className="wrapper">
          <h2 className="font-bold text-center">
            {currentYear} Omar Elemam. All rights reserved
          </h2>
        </div>
      </div>
    </>
  );
};

export default Footer;
