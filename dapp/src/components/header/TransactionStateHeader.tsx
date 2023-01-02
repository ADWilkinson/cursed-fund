export enum TransactionStateHeaderState {
  none,
  failed,
  pending,
  success,
}

type TransactionStateHeaderProps = {
  isDarkMode: boolean;
  onClick: () => void;
  state: TransactionStateHeaderState;
};

const TransactionStateHeader = ({
  isDarkMode,
  onClick,
  state,
}: TransactionStateHeaderProps) => (
  <span
    onClick={onClick}
    className="hidden md:inline-flex items-center px-3 py-0.5 rounded-xl text-base font-medium bg-transparent "
  >
    <TransactionStateView isDarkMode={isDarkMode} state={state} />
  </span>
);

type TransactionStateViewProps = {
  isDarkMode: boolean;
  state: TransactionStateHeaderState;
};

const TransactionStateView = (props: TransactionStateViewProps) => {
  switch (props.state) {
    case TransactionStateHeaderState.failed:
      return (
        <>
          <svg
            className="-ml-1 mr-1.5 h-2 w-2 text-theme-pan-champagne animate animate-pulse"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx={4} cy={4} r={3} />
          </svg>
          <span className="text-theme-pan-champagne">Transaction Failed</span>
        </>
      );
    case TransactionStateHeaderState.pending:
      return (
        <>
          <svg
            className="-ml-1 mr-1.5 h-2 w-2 text-theme-pan-champagne animate animate-pulse"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx={4} cy={4} r={3} />
          </svg>
          <span className="text-theme-pan-champagne animate-pulse">
            Transaction Pending
          </span>
        </>
      );
    case TransactionStateHeaderState.success:
      return (
        <>
          <svg
            className="-ml-1 mr-1.5 h-2 w-2 text-theme-pan-champagne animate animate-pulse"
            fill="currentColor"
            viewBox="0 0 8 8"
          >
            <circle cx={4} cy={4} r={3} />
          </svg>
          <span className="text-theme-pan-champagne">Transaction Succeeded</span>
        </>
      );
    default:
      return <></>;
  }
};

export default TransactionStateHeader;
