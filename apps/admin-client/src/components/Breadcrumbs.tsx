import { Link } from "react-router-dom";

function Spacer() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5 flex-shrink-0 text-gray-300"
    >
      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
  );
}

type BreadCrumbLink = {
  href?: string;
  text: string;
};

interface Props {
  links: BreadCrumbLink[];
}
export default function Breadcrumbs({ links }: Props) {
  const lastIndex = links.length - 1;
  return (
    <nav className="mb-8 md:flex md:items-center">
      {links.map((link, index) =>
        index === lastIndex ? (
          <span
            key={index}
            className="font-medium text-gray-500 hover:text-gray-900"
          >
            {link.text}
          </span>
        ) : (
          <>
            <Link
              to={link.href}
              className="font-medium text-gray-500 hover:text-gray-900"
            >
              {link.text}
            </Link>
            <Spacer />
          </>
        )
      )}
    </nav>
  );
}
