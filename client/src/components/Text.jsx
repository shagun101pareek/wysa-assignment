function Text({ component: Tag = "span", className, children, ...props }) {
  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>
  );
}

export default Text;
