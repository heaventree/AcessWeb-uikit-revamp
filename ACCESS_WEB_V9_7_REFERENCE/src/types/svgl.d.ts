declare module 'svgl' {
  const icons: Record<string, React.ComponentType<React.SVGAttributes<SVGElement>>>;
  export default icons;
  export const React: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Typescript: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Tailwindcss: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Vite: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Github: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Aws: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Slack: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Google: React.ComponentType<React.SVGAttributes<SVGElement>>;
  export const Firebase: React.ComponentType<React.SVGAttributes<SVGElement>>;
}