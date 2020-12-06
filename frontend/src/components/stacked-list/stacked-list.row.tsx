import React from "react";
import { Link } from "react-router-dom";

type Tag = { label: string; color: "blue" | "red" | "green" };

export interface ICustomStackedListRowProps extends IStackedListRowProps {
  date: Date;
}
export interface IStackedListRowProps {
  additionalInformation?: string[];
  additionalLabel?: string;
  label: string;
  link?: string;
  tags?: Tag[];
  id: string;
}

const StackedListRow = ({
  additionalInformation,
  additionalLabel,
  label,
  link,
  tags,
}: IStackedListRowProps): JSX.Element => {
  const stackedListRowContent = (
    <div className="px-4 py-4 flex items-center">
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-medium truncate">{label}</h3>
        {additionalInformation && (
          <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-xs text-gray-500">
            {additionalInformation.map((information, index) => (
              <p
                className={index !== 0 ? "mt-1 sm:mt-0" : ""}
                key={information}
              >
                <>
                  {index !== 0 && (
                    <span className="hidden sm:inline-block sm:mx-1">|</span>
                  )}
                  {information}
                </>
              </p>
            ))}
          </div>
        )}
      </div>
      {additionalLabel && (
        <div className="flex-shrink-0 pl-4">
          {tags && (
            <div className="mb-1 text-right">
              {tags.map(({ label: tagLabel, color }) => (
                <p
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${color}-100 text-${color}-800`}
                  key={tagLabel}
                >
                  {tagLabel}
                </p>
              ))}
            </div>
          )}
          <p className="font-medium">{additionalLabel}</p>
        </div>
      )}
    </div>
  );

  return (
    <li>
      {link ? (
        <Link
          to={link}
          className="block hover:bg-gray-50 focus:bg-gray-50 outline-none"
        >
          {stackedListRowContent}
        </Link>
      ) : (
        stackedListRowContent
      )}
    </li>
  );
};

export default StackedListRow;