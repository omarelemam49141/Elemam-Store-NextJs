const ProductsList = ({
  data,
  limit,
  title,
}: {
  data: any;
  limit?: number;
  title?: string;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <>
      {title ? <h2 className="h2-bold mb-5">{title}</h2> : ""}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {limitedData.map((product: any, index: number) => (
          <div key={index}>{product.name}</div>
        ))}
      </div>
    </>
  );
};

export default ProductsList;
