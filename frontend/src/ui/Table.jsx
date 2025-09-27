function Table({ children, className = "" }) {
  return (
    <div className={`bg-secondary-0 overflow-x-auto ${className}`}>
      {" "}
      <table>{children}</table>
    </div>
  );
}

function TableHeader({ children }) {
  return (
    <thead>
      <tr className="title-row">{children}</tr>
    </thead>
  );
}

function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

function TableRow({ children, className = "", ...rest }) {
  return (
    <tr className={className} {...rest}>
      {children}
    </tr>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;

export default Table;
