interface PageTitleProps {
  title: string;
  subtitle: string;
}

const PageTitle = (props: PageTitleProps) => {
  return (
    <div className="flex m-auto text-center justify-center pb-4 bg-theme-pan-champagne pt-6 rounded-t-2xl">
      <div className="flex-1 min-w-0  m-auto text-center justify-center">
        <h2 className="text-3xl  m-auto text-center justify-center font-bold leading-7 font-morion text-theme-pan-navy sm:text-4xl sm:truncate">
          {props.title}
        </h2>
        <p className="text-xl pt-2 text-theme-pan-navy  m-auto text-center justify-center">
          {props.subtitle}
        </p>
      </div>
    </div>
  );
};

export default PageTitle;
