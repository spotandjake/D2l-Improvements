interface LinkProps {
  Title: string;
  Href: string;
  Active: boolean;
  Route?: Function;
  children: JSX.Element[];
}
const Link = ({ Title, Href, Active, children, Route }: LinkProps) => {
  const click = (title: string, href: string, active: boolean) => {
    if (active) {
      if (Route) {
        // Change url
        history.pushState({ Title: title, Url: href }, title, href);
        // Change Page
        Route();
      } else window.location.href = href;
    }
  };
  return (
    <div
      onClick={() => {
        click(Title, Href, Active);
      }}
    >
      {children}
    </div>
  );
};

export default Link;
