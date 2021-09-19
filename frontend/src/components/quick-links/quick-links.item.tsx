import React from "react";
import { NavLink } from "react-router-dom";
import Icon, { IconName } from "../icon/icon";

interface IQuickLinksItemProps {
  title: string;
  link: string;
  description: string;
  iconName: IconName;
  iconBackgroundColor?: "green" | "red" | "blue";
}

const QuickLinksItem = ({
  title,
  link,
  description,
  iconName,
  iconBackgroundColor = "blue",
}: IQuickLinksItemProps): JSX.Element => {
  return (
    <>
      <div>
        <span
          className={`rounded-lg inline-flex p-3 text-white ring-4 ring-white ${
            iconBackgroundColor === "blue" && "bg-blue-financer"
          } ${iconBackgroundColor === "green" && "bg-green-600"} ${
            iconBackgroundColor === "red" && "bg-red-600"
          }`}
        >
          <Icon type={iconName} />
        </span>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-medium">
          <NavLink to={link} className="focus:outline-none">
            <span className="absolute inset-0" aria-hidden="true" />
            {title}
          </NavLink>
        </h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      <span
        className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
        aria-hidden="true"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
        </svg>
      </span>
    </>
  );
};

export default QuickLinksItem;