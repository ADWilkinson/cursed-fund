interface SectionTitleProps {
  title: string;
}

const SectionTitle = (props: SectionTitleProps) => {
  return (
    <div className="relative mb-4">
      <div className="relative flex justify-center text-center">
        <span className="md:pl-0 pl-4 pr-3 bg-transparent font-morion text-lg font-semibold text-theme-champagne">
          {props.title}
        </span>
      </div>
    </div>
  );
};

export default SectionTitle;
