import Image from "next/image";
import loader from "@/assets/loader.gif";

const Loading = () => {
  return (
    <div className="h-screen max-w-screen flex-center">
      <Image src={loader} alt="loading..." width={150} height={150}></Image>
    </div>
  );
};

export default Loading;
