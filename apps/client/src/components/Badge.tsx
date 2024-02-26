import { BadgeColor } from "@/common/badge-color.constants";
import { classNames } from "utils";

interface Props {
  children: JSX.Element | string | number;
  color?: BadgeColor;
  className?: string;
}

export default function Badge({
  children: text,
  color = BadgeColor.Gray,
  className = "",
}: Props) {
  const cssClasses = `inline-flex items-center px-2 py-1 text-xs ring-1 ring-inset ${className}`;

  return (
    <>
      {color === BadgeColor.Gray && (
        <span
          className={classNames(
            cssClasses,
            "bg-gray-50 text-gray-600 ring-gray-500/10",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Red && (
        <span
          className={classNames(
            cssClasses,
            "bg-red-50 text-red-700 ring-red-700/10",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Orange && (
        <span
          className={classNames(
            cssClasses,
            "bg-orange-50 text-orange-700 ring-orange-600/20",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Yellow && (
        <span
          className={classNames(
            cssClasses,
            "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Green && (
        <span
          className={classNames(
            cssClasses,
            "bg-green-50 text-green-700 ring-green-600/20",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Blue && (
        <span
          className={classNames(
            cssClasses,
            "bg-blue-50 text-blue-700 ring-blue-700/10",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Indigo && (
        <span
          className={classNames(
            cssClasses,
            "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Purple && (
        <span
          className={classNames(
            cssClasses,
            "bg-purple-50 text-purple-700 ring-purple-700/10",
          )}
        >
          {text}
        </span>
      )}
      {color === BadgeColor.Pink && (
        <span
          className={classNames(
            cssClasses,
            "bg-pink-50 text-pink-700 ring-pink-700/10",
          )}
        >
          {text}
        </span>
      )}
    </>
  );
}
