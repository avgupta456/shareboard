export const classnames = (...args: (string | undefined | null | false)[]) => {
  return args.filter(Boolean).join(" ");
};
