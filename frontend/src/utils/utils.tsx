export const classnames = (...args: (string | undefined | null | false)[]) => {
  return args.filter(Boolean).join(" ");
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
