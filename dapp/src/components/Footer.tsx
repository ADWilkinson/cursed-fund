const Footer = () => {
  return <footer className="text-center justify-center ">
    <div>
      <a
        href="https://cursed-fund.canny.io/feature-requests"
        target={"_blank"}
        rel={"noreferrer"}
      >
        Feedback
      </a>
      &nbsp; | &nbsp;
      <a
        href="https://cursed-fund.canny.io/bugs"
        target={"_blank"}
        rel={"noreferrer"}
      >
        Report a Bug
      </a>
      &nbsp; | &nbsp;
      <a
        href="https://github.com/ADWilkinson/lensfrensfund"
        target={"_blank"}
        rel={"noreferrer"}
      >
        GitHub
      </a>
    </div>
    <div>
      <span role="img" aria-label="sheep">
        Built for the Bilgerats by{' '}
      </span>
      <a href="https://twitter.com/andrew_eth" className="text-theme-pan-sky" target="blank">
        @andrew_eth
      </a>
    </div>
  </footer>;
}

export default Footer