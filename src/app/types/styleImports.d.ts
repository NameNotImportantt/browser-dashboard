declare module '*.scss' {
  const css: string;
  export default css;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
