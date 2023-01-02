const Page = (props: { children?: JSX.Element }) => {
  return (
    <div className="bg-[url('./assets/Frame.png')] bg-theme-pan-champagne bg-cover bg-no-repeat bg-center pt-10 pb-10 bg-opacity-100  min-h-screen">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{props.children}</div>
    </div>
  );
};

export default Page;
