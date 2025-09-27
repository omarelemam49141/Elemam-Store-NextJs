const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p className={`text-2xl space-x-0.5 ${className}`}>
      <span className="align-super text-xs">$</span>
      <span>{intValue}</span>
      <span className="align-super text-xs">.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
